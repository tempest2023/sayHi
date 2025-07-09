import React, { memo } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Avatar as PaperAvatar } from 'react-native-paper';
import PropTypes from 'prop-types';
import { colors, sizes, shadows } from '../../theme';

const defaultAvatar = require('../../assets/default_avatar.png');

const styles = StyleSheet.create({
  container: {
    width: sizes.avatar.md,
    height: sizes.avatar.md,
    borderRadius: sizes.avatar.md / 2,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: sizes.avatar.md / 2,
  },
  placeholder: {
    width: '100%',
    height: '100%',
    borderRadius: sizes.avatar.md / 2,
    backgroundColor: colors.neutral[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: colors.background.default,
  },
});

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
  const avatarSize = sizes.avatar[size];
  const onlineIndicatorSize = Math.max(8, avatarSize * 0.2);
  
  return (
    <View style={[styles.container, style]}>
      <PaperAvatar.Image
        size={avatarSize}
        source={source ? { uri: source } : defaultAvatar}
        style={[
          styles.avatar,
          shadows.sm,
          { backgroundColor: colors.neutral[100] }
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
                ? colors.semantic.success 
                : colors.neutral[400],
              borderWidth: 2,
              borderColor: colors.background.default,
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

Avatar.propTypes = {
  source: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'xxl']),
  showOnlineStatus: PropTypes.bool,
  isOnline: PropTypes.bool,
  accessibilityLabel: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default memo(Avatar);