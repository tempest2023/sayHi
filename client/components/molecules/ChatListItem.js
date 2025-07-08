import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Avatar from '../atoms/Avatar';
import Typography from '../atoms/Typography';
import TouchableArea from '../atoms/TouchableArea';
import theme from '../../theme';

/**
 * ChatListItem component for displaying individual chat/friend items in lists
 * 
 * @param {Object} props
 * @param {Object} props.user - User object containing avatar, name, etc.
 * @param {string} props.lastMessage - Last message preview
 * @param {string} props.timestamp - Message timestamp
 * @param {boolean} props.hasUnread - Whether there are unread messages
 * @param {number} props.unreadCount - Number of unread messages
 * @param {Function} props.onPress - Press handler
 * @param {Object} props.style - Additional styles
 */
function ChatListItem({
  user,
  lastMessage = 'No messages yet',
  timestamp,
  hasUnread = false,
  unreadCount = 0,
  onPress,
  style,
  ...props
}) {
  const displayName = user?.realname || user?.username || 'Unknown User';
  const accessibilityLabel = `Chat with ${displayName}. ${
    hasUnread ? `${unreadCount} unread messages. ` : ''
  }Last message: ${lastMessage}`;

  return (
    <TouchableArea
      onPress={() => onPress(user)}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint="Tap to open chat conversation"
      style={[styles.container, style]}
      {...props}
    >
      <View style={styles.content}>
        <Avatar
          source={user?.avatar}
          size="lg"
          showOnlineStatus={true}
          isOnline={user?.isOnline}
          accessibilityLabel={`${displayName}'s profile picture`}
          style={styles.avatar}
        />
        
        <View style={styles.textContainer}>
          <View style={styles.headerRow}>
            <Typography
              variant="body1"
              color="primary"
              style={[
                styles.userName,
                hasUnread && styles.unreadText
              ]}
              numberOfLines={1}
            >
              {displayName}
            </Typography>
            
            {timestamp && (
              <Typography
                variant="caption"
                color="secondary"
                style={styles.timestamp}
              >
                {timestamp}
              </Typography>
            )}
          </View>
          
          <View style={styles.messageRow}>
            <Typography
              variant="body2"
              color="secondary"
              style={[
                styles.lastMessage,
                hasUnread && styles.unreadText
              ]}
              numberOfLines={2}
            >
              {lastMessage}
            </Typography>
            
            {hasUnread && unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Typography
                  variant="caption"
                  color="inverse"
                  style={styles.unreadCount}
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Typography>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableArea>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background.default,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[200],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: theme.spacing.md,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  userName: {
    flex: 1,
    fontWeight: '600',
  },
  timestamp: {
    marginLeft: theme.spacing.sm,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  lastMessage: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  unreadText: {
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  unreadBadge: {
    backgroundColor: theme.colors.primary[500],
    borderRadius: theme.borderRadius.full,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xs,
  },
  unreadCount: {
    fontSize: 10,
    fontWeight: '600',
  },
});

ChatListItem.propTypes = {
  user: PropTypes.shape({
    userid: PropTypes.string,
    username: PropTypes.string,
    realname: PropTypes.string,
    avatar: PropTypes.string,
    isOnline: PropTypes.bool,
  }).isRequired,
  lastMessage: PropTypes.string,
  timestamp: PropTypes.string,
  hasUnread: PropTypes.bool,
  unreadCount: PropTypes.number,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default memo(ChatListItem);