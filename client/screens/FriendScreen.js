import React, { memo, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Background from '../components/Background';
import TabNavigation from '../components/TabNavigation';
import FriendsList from '../components/organisms/FriendsList';
import MsgModal, { showModal, hideModal } from '../components/MsgModal';
import useFriends from '../hooks/useFriends';
import tabs from './tabs';
import theme from '../theme';

/**
 * Refactored FriendScreen with clean architecture:
 * - Separated data logic into custom hook
 * - UI decomposed into reusable components
 * - Performance optimized with FlatList
 * - Improved accessibility and error handling
 * - Modern design system implementation
 */
function FriendScreen({ navigation }) {
  // Data and business logic handled by custom hook
  const {
    friends,
    loading,
    error,
    refreshing,
    refreshFriends,
  } = useFriends();

  // Modal state for error handling
  const [visible, setVisible] = React.useState(false);
  const [modalTitle, setModalTitle] = React.useState('');
  const [modalMessage, setModalMessage] = React.useState('');

  /**
   * Handle friend/chat item press
   * Navigates to chat screen with proper user context
   */
  const handleFriendPress = useCallback((friend) => {
    if (!friend?.userid) {
      setModalTitle('Error');
      setModalMessage('Unable to open chat. Please try again.');
      showModal(setVisible);
      return;
    }

    navigation.navigate('ChatScreen', { userid: friend.userid });
  }, [navigation]);

  /**
   * Handle empty state action
   * Navigates to discovery/pick screen
   */
  const handleEmptyAction = useCallback(() => {
    navigation.navigate('PickScreen');
  }, [navigation]);

  /**
   * Handle refresh with error handling
   */
  const handleRefresh = useCallback(() => {
    try {
      refreshFriends();
    } catch (err) {
      setModalTitle('Error');
      setModalMessage('Failed to refresh friends list. Please try again.');
      showModal(setVisible);
    }
  }, [refreshFriends]);

  /**
   * Handle modal close
   */
  const handleModalClose = useCallback(() => {
    hideModal(setVisible);
  }, []);

  return (
    <Background style={styles.container}>
      {/* Error Modal */}
      <MsgModal
        title={modalTitle}
        msg={modalMessage}
        type="normal"
        okText="Got it"
        okCallback={handleModalClose}
        visible={visible}
      />

      {/* Friends List with all states handled */}
      <FriendsList
        friends={friends}
        loading={loading}
        error={error}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onFriendPress={handleFriendPress}
        onEmptyAction={handleEmptyAction}
        style={styles.friendsList}
      />

      {/* Bottom Tab Navigation */}
      <TabNavigation
        navigation={navigation}
        tabs={tabs}
        active="FriendScreen"
      />
    </Background>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  friendsList: {
    flex: 1,
    marginBottom: 80, // Account for tab navigation
  },
});

FriendScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default memo(FriendScreen);
