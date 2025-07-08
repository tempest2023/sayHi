import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar as PaperAvatar } from 'react-native-paper';
import PropTypes from 'prop-types';
import theme from '../../theme';

const defaultAvatar = require('../../assets/default_avatar.png');

/**
 * Enhanced Avatar component with size variants and online status indicator
 * 
 * @param {Object} props
 * @param {string} props.source - Image source URL
 * @param {'xs'|'sm'|'md'|'lg'|'xl'|'xxl'} props.size - Avatar size
 * @param {boolean} props.showOnlineStatus - Whether to show online status indicator
 * @param {boolean} props.isOnline - Online status (only shown if showOnlineStatus is true)
 * @param {string} props.accessibilityLabel - Accessibility label for the avatar
 * @param {Object} props.style - Additional styles
 */
function Avatar({ 
  source, 
  size = 'md', 
  showOnlineStatus = false, 
  isOnline = false,
  accessibilityLabel = 'User avatar',
  style,
  ...props 
}) {
  const avatarSize = theme.sizes.avatar[size];
  const onlineIndicatorSize = Math.max(8, avatarSize * 0.2);
  
  return (
    <View style={[styles.container, style]}>
      <PaperAvatar.Image
        size={avatarSize}
        source={source ? { uri: source } : defaultAvatar}
        style={[
          styles.avatar,
          theme.shadows.sm,
          { backgroundColor: theme.colors.neutral[100] }
        ]}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="image"
        {...props}
      />
      {showOnlineStatus && (
        <View 
          style={[
            styles.onlineIndicator,
            {
              width: onlineIndicatorSize,
              height: onlineIndicatorSize,
              borderRadius: onlineIndicatorSize / 2,
              backgroundColor: isOnline 
                ? theme.colors.semantic.success 
                : theme.colors.neutral[400],
              borderWidth: 2,
              borderColor: theme.colors.background.default,
              position: 'absolute',
              bottom: 0,
              right: 0,
            }
          ]}
          accessibilityLabel={isOnline ? 'Online' : 'Offline'}
          accessibilityRole="text"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatar: {
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
  }
});

Avatar.propTypes = {
  source: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'xxl']),
  showOnlineStatus: PropTypes.bool,
  isOnline: PropTypes.bool,
  accessibilityLabel: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default memo(Avatar);