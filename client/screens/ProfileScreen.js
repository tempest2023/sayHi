import React, { memo, useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import PropTypes from 'prop-types';
import Background from '../components/Background';
import Header from '../components/Header';
import Avatar from '../components/atoms/Avatar';
import Typography from '../components/atoms/Typography';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import TabNavigation from '../components/TabNavigation';
import MsgModal, { showModal, hideModal } from '../components/MsgModal';
import useProfile from '../hooks/useProfile';
import tabs from './tabs';
import { spacing, shadows, colors } from '../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
    paddingHorizontal: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
    backgroundColor: colors.background.default,
    ...shadows.sm,
  },
  avatar: {
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: spacing.sm,
  },
  form: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  input: {
    marginBottom: spacing.sm,
  },
  actions: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    backgroundColor: colors.background.default,
    gap: spacing.md,
  },
  saveButton: {
    marginTop: spacing.md,
    // Primary button styling handled by Button component
  },
  logoutButton: {
    // Outlined button styling handled by Button component
  },
});

/**
 * Refactored ProfileScreen with clean architecture:
 * - Separated data logic into useProfile hook
 * - Enhanced form validation and error handling
 * - Improved loading and saving states
 * - Better accessibility and user experience
 * - Modern design system implementation
 */
function ProfileScreen({ navigation }) {
  // Data and business logic handled by custom hook
  const {
    profile,
    loading,
    saving,
    errors,
    updateField,
    saveProfile,
    logout,
    getDisplayName,
  } = useProfile();

  // Modal state for feedback
  const [visible, setVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  /**
   * Handle authentication failure
   */
  useEffect(() => {
    if (!loading && !profile.username) {
      // If profile couldn't be loaded, redirect to login
      navigation.navigate('LoginScreen');
    }
  }, [loading, profile.username, navigation]);

  /**
   * Handle save profile with feedback
   */
  const handleSave = useCallback(async () => {
    const result = await saveProfile();
    
    setModalTitle(result.success ? 'Success' : 'Error');
    setModalMessage(result.message);
    showModal(setVisible);
  }, [saveProfile]);

  /**
   * Handle logout with navigation
   */
  const handleLogout = useCallback(async () => {
    const success = await logout();
    if (success) {
      navigation.navigate('HomeScreen');
    } else {
      setModalTitle('Error');
      setModalMessage('Failed to logout. Please try again.');
      showModal(setVisible);
    }
  }, [logout, navigation]);

  /**
   * Handle modal close
   */
  const handleModalClose = useCallback(() => {
    hideModal(setVisible);
  }, []);

  /**
   * Handle field changes
   */
  const handleFieldChange = useCallback((field) => (value) => {
    updateField(field, value);
  }, [updateField]);

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <Background style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Typography
            variant="body1"
            color="secondary"
            center
            style={styles.loadingText}
          >
            Loading profile...
          </Typography>
        </View>
        <TabNavigation navigation={navigation} tabs={tabs} active="ProfileScreen" />
      </Background>
    );
  }

  return (
    <Background style={styles.container}>
      {/* Modal for feedback */}
      <MsgModal
        title={modalTitle}
        msg={modalMessage}
        type="normal"
        okText="Got it"
        okCallback={handleModalClose}
        visible={visible}
      />

      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Avatar
          source={profile.avatar}
          size="xl"
          style={styles.avatar}
          accessibilityLabel={`${getDisplayName()}'s profile picture`}
        />
        <Header variant="h3" style={styles.headerTitle}>
          {getDisplayName()}
        </Header>
      </View>

      {/* Profile Form */}
      <View style={styles.form}>
        <TextInput
          label="Username"
          value={profile.username}
          onChangeText={handleFieldChange('username')}
          errorText={errors.username}
          autoCapitalize="none"
          accessibilityLabel="Username"
          style={styles.input}
        />

        <TextInput
          label="Real Name"
          value={profile.realname}
          onChangeText={handleFieldChange('realname')}
          errorText={errors.realname}
          accessibilityLabel="Real name"
          style={styles.input}
        />

        <TextInput
          label="Email"
          value={profile.email}
          onChangeText={handleFieldChange('email')}
          errorText={errors.email}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoCompleteType="email"
          accessibilityLabel="Email address"
          style={styles.input}
        />

        <TextInput
          label="Gender"
          value={profile.gender}
          onChangeText={handleFieldChange('gender')}
          errorText={errors.gender}
          autoCapitalize="none"
          accessibilityLabel="Gender"
          style={styles.input}
        />

        <TextInput
          label="Age"
          value={profile.age}
          onChangeText={handleFieldChange('age')}
          errorText={errors.age}
          keyboardType="numeric"
          accessibilityLabel="Age"
          style={styles.input}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={handleSave}
          loading={saving}
          disabled={loading}
          style={styles.saveButton}
          accessibilityLabel="Save profile changes"
        >
          Update Profile
        </Button>

        <Button
          mode="outlined"
          onPress={handleLogout}
          disabled={saving}
          style={styles.logoutButton}
          accessibilityLabel="Logout of account"
        >
          Logout
        </Button>
      </View>

      {/* Bottom Tab Navigation */}
      <TabNavigation navigation={navigation} tabs={tabs} active="ProfileScreen" />
    </Background>
  );
}

ProfileScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default memo(ProfileScreen);
