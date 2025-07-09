import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import PropTypes from 'prop-types';
import Avatar from '../atoms/Avatar';
import Typography from '../atoms/Typography';
import Button from '../Button';
import { colors, spacing, borderRadius, shadows } from '../../theme';

const styles = StyleSheet.create({
  card: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: colors.background.default,
    ...shadows.md,
    borderRadius: borderRadius.xl,
  },
  content: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  avatar: {
    marginBottom: spacing.lg,
  },
  name: {
    marginBottom: spacing.sm,
  },
  username: {
    marginBottom: spacing.lg,
  },
  infoSection: {
    width: '100%',
    marginTop: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  infoLabel: {
    flex: 1,
  },
  infoValue: {
    flex: 2,
    textAlign: 'right',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  skipButton: {
    flex: 1,
  },
  chatButton: {
    flex: 1,
  },
});

/**
 * UserDiscoveryCard organism component for displaying discoverable users
 * 
 * @param {Object} props
 * @param {Object} props.user - User object to display
 * @param {Function} props.onSkip - Skip button handler
 * @param {Function} props.onChat - Chat button handler
 * @param {boolean} props.loading - Loading state
 * @param {Object} props.style - Additional styles
 */
function UserDiscoveryCard({
  user,
  onSkip,
  onChat,
  loading = false,
  style,
  ...props
}) {
  if (!user) return null;

  const displayName = user.displayName || user.realname || user.username || 'Unknown User';

  return (
    <Card style={[styles.card, style]} {...props}>
      <Card.Content style={styles.content}>
        {/* User Avatar */}
        <Avatar
          source={user.avatar}
          size="xxl"
          style={styles.avatar}
          accessibilityLabel={`${displayName}'s profile picture`}
        />
        
        {/* User Name */}
        <Typography
          variant="h2"
          center
          style={styles.name}
        >
          {displayName}
        </Typography>
        
        {/* Username */}
        {user.username && user.username !== displayName && (
          <Typography
            variant="body2"
            color="secondary"
            center
            style={styles.username}
          >
            @{user.username}
          </Typography>
        )}
        
        {/* User Information */}
        <View style={styles.infoSection}>
          <Typography
            variant="h4"
            style={styles.sectionTitle}
          >
            About
          </Typography>
          
          <UserInfoItem
            label="Gender"
            value={user.gender || 'Not specified'}
          />
          
          <UserInfoItem
            label="Age"
            value={user.age ? `${user.age} years old` : 'Not specified'}
          />
          
          <UserInfoItem
            label="Email"
            value={user.email || 'Not shared'}
          />
        </View>
      </Card.Content>
      
      {/* Action Buttons */}
      <Card.Actions style={styles.actions}>
        <Button
          mode="outlined"
          onPress={onSkip}
          disabled={loading}
          style={styles.skipButton}
          accessibilityLabel="Skip this person"
          accessibilityHint="Skip to see another person"
        >
          Skip
        </Button>
        
        <Button
          mode="contained"
          onPress={() => onChat(user)}
          disabled={loading}
          style={styles.chatButton}
          accessibilityLabel={`Start chatting with ${displayName}`}
          accessibilityHint="Start a conversation with this person"
        >
          Chat
        </Button>
      </Card.Actions>
    </Card>
  );
}

/**
 * UserInfoItem component for displaying user information
 */
function UserInfoItem({ label, value }) {
  return (
    <View style={styles.infoItem}>
      <Typography
        variant="body2"
        color="secondary"
        style={styles.infoLabel}
      >
        {label}:
      </Typography>
      <Typography
        variant="body1"
        style={styles.infoValue}
      >
        {value}
      </Typography>
    </View>
  );
}

UserDiscoveryCard.propTypes = {
  user: PropTypes.shape({
    userid: PropTypes.string.isRequired,
    username: PropTypes.string,
    realname: PropTypes.string,
    displayName: PropTypes.string,
    avatar: PropTypes.string,
    gender: PropTypes.string,
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    email: PropTypes.string,
  }).isRequired,
  onSkip: PropTypes.func.isRequired,
  onChat: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

UserInfoItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default memo(UserDiscoveryCard);