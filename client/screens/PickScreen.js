import React, { memo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, ScrollView } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { colors, spacing } from '../theme';
import Background from '../components/Background';
import TabNavigation from '../components/TabNavigation';
import UserDiscoveryCard from '../components/organisms/UserDiscoveryCard';
import EmptyState from '../components/molecules/EmptyState';
import Typography from '../components/atoms/Typography';
import MsgModal, { showModal, hideModal } from '../components/MsgModal';
import useDiscovery from '../hooks/useDiscovery';
import tabs from './tabs';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  discoveryCard: {
    alignSelf: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.xl,
  },
});

/**
 * Refactored PickScreen with clean architecture:
 * - Separated data logic into useDiscovery hook
 * - UI decomposed into UserDiscoveryCard organism
 * - Improved error handling and loading states
 * - Enhanced accessibility and user experience
 * - Modern design system implementation
 */
function PickScreen({ navigation }) {
  // Data and business logic handled by custom hook
  const {
    currentUser,
    loading,
    error,
    skipUser,
    retry,
    isValidUser,
  } = useDiscovery();

  // Modal state for error handling
  const [visible, setVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  /**
   * Handle chat navigation
   */
  const handleChat = useCallback((user) => {
    if (!user?.userid || !isValidUser(user)) {
      setModalTitle('Error');
      setModalMessage('Unable to start chat. Please try another person.');
      showModal(setVisible);
      return;
    }

    navigation.navigate('ChatScreen', { userid: user.userid });
  }, [navigation, isValidUser]);

  /**
   * Handle skip action with error handling
   */
  const handleSkip = useCallback(async () => {
    try {
      await skipUser();
    } catch (err) {
      setModalTitle('Error');
      setModalMessage('Failed to load next person. Please try again.');
      showModal(setVisible);
    }
  }, [skipUser]);

  /**
   * Handle retry action
   */
  const handleRetry = useCallback(() => {
    retry();
  }, [retry]);

  /**
   * Handle modal close
   */
  const handleModalClose = useCallback(() => {
    hideModal(setVisible);
  }, []);

  /**
   * Render loading state
   */
  if (loading && !currentUser) {
    return (
      <Background position="containerCenter" style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Typography
          variant="body1"
          color="secondary"
          center
          style={styles.loadingText}
        >
          Finding interesting people for you...
        </Typography>
        <TabNavigation navigation={navigation} tabs={tabs} active="PickScreen" />
      </Background>
    );
  }

  /**
   * Render error state
   */
  if (error && !currentUser) {
    return (
      <Background position="containerCenter" style={styles.container}>
        <EmptyState
          title="Oops! Something went wrong"
          description={error}
          actionText="Try Again"
          onAction={handleRetry}
        />
        <TabNavigation navigation={navigation} tabs={tabs} active="PickScreen" />
      </Background>
    );
  }

  /**
   * Render empty state (no users available)
   */
  if (!currentUser && !loading && !error) {
    return (
      <Background position="containerCenter" style={styles.container}>
        <EmptyState
          title="No one new right now"
          description="Check back later to discover more people in your area!"
          actionText="Refresh"
          onAction={handleRetry}
        />
        <TabNavigation navigation={navigation} tabs={tabs} active="PickScreen" />
      </Background>
    );
  }

  return (
    <Background position="containerCenterWithTab" style={styles.container}>
      {/* Error Modal */}
      <MsgModal
        title={modalTitle}
        msg={modalMessage}
        type="normal"
        okText="Got it"
        okCallback={handleModalClose}
        visible={visible}
      />

      {/* User Discovery Card */}
      {currentUser && (
        <UserDiscoveryCard
          user={currentUser}
          onSkip={handleSkip}
          onChat={handleChat}
          loading={loading}
          style={styles.discoveryCard}
        />
      )}

      {/* Bottom Tab Navigation */}
      <TabNavigation navigation={navigation} tabs={tabs} active="PickScreen" />
    </Background>
  );
}

PickScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default memo(PickScreen);
