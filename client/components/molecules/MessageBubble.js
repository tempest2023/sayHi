import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Avatar from '../atoms/Avatar';
import Typography from '../atoms/Typography';
import { spacing, borderRadius, colors, shadows } from '../../theme';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  ownMessage: {
    justifyContent: 'flex-end',
    flexDirection: 'row-reverse',
  },
  otherMessage: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  avatar: {
    marginHorizontal: spacing.sm,
  },
  bubble: {
    maxWidth: '70%',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  ownBubble: {
    backgroundColor: colors.primary[500],
    borderBottomRightRadius: borderRadius.sm,
  },
  otherBubble: {
    backgroundColor: colors.neutral[100],
    borderBottomLeftRadius: borderRadius.sm,
  },
  messageText: {
    textAlign: 'left',
  },
  timestamp: {
    marginTop: spacing.xs,
    textAlign: 'right',
    opacity: 0.7,
    fontSize: 10,
  },
});

/**
 * MessageBubble component for displaying individual chat messages
 * 
 * @param {Object} props
 * @param {Object} props.message - Message object with text, sender, time
 * @param {boolean} props.isOwn - Whether this message is from current user
 * @param {string} props.userAvatar - Avatar URL for the sender
 * @param {string} props.otherAvatar - Avatar URL for the other person
 * @param {Object} props.style - Additional styles
 */
function MessageBubble({
  message,
  isOwn = false,
  userAvatar,
  otherAvatar,
  style,
  ...props
}) {
  const avatarSource = isOwn ? userAvatar : otherAvatar;
  const displayName = isOwn ? 'You' : 'Friend';

  return (
    <View 
      style={[
        styles.container,
        isOwn ? styles.ownMessage : styles.otherMessage,
        style
      ]}
      {...props}
    >
      {!isOwn && (
        <Avatar
          source={avatarSource}
          size="sm"
          style={styles.avatar}
          accessibilityLabel={`${displayName}'s avatar`}
        />
      )}
      
      <View 
        style={[
          styles.bubble,
          isOwn ? styles.ownBubble : styles.otherBubble,
          shadows.sm
        ]}
        accessibilityRole="text"
        accessibilityLabel={`Message from ${displayName}: ${message.text}`}
      >
        <Typography
          variant="body2"
          color={isOwn ? "inverse" : "primary"}
          style={styles.messageText}
        >
          {message.text}
        </Typography>
        
        {message.time && (
          <Typography
            variant="caption"
            color={isOwn ? "inverse" : "secondary"}
            style={styles.timestamp}
          >
            {new Date(parseInt(message.time, 10)).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Typography>
        )}
      </View>
      
      {isOwn && (
        <Avatar
          source={avatarSource}
          size="sm"
          style={styles.avatar}
          accessibilityLabel={`${displayName}'s avatar`}
        />
      )}
    </View>
  );
}

MessageBubble.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    text: PropTypes.string.isRequired,
    sender: PropTypes.string.isRequired,
    time: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  isOwn: PropTypes.bool,
  userAvatar: PropTypes.string,
  otherAvatar: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default memo(MessageBubble);