import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { sizes } from '../../theme';

// Move styles above the TouchableArea component definition
const styles = StyleSheet.create({
  touchable: {
    minHeight: sizes.touch.min,
    minWidth: sizes.touch.min,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  }
});

/**
 * TouchableArea component that ensures proper accessibility and touch targets
 * 
 * @param {Object} props
 * @param {Function} props.onPress - Press handler
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.accessibilityHint - Accessibility hint
 * @param {'button'|'link'|'tab'} props.accessibilityRole - Accessibility role
 * @param {'comfortable'|'large'|'min'} props.touchSize - Minimum touch target size
 * @param {boolean} props.disabled - Whether the component is disabled
 * @param {Object} props.style - Additional styles
 * @param {React.ReactNode} props.children - Child components
 */
function TouchableArea({
  onPress,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
  touchSize = 'comfortable',
  disabled = false,
  style,
  children,
  ...props
}) {
  const minHeight = sizes.touch[touchSize];
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole}
      style={[
        styles.touchable,
        { minHeight },
        disabled && styles.disabled,
        style
      ]}
      activeOpacity={0.7}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
}

TouchableArea.propTypes = {
  onPress: PropTypes.func.isRequired,
  accessibilityLabel: PropTypes.string.isRequired,
  accessibilityHint: PropTypes.string,
  accessibilityRole: PropTypes.oneOf(['button', 'link', 'tab']),
  touchSize: PropTypes.oneOf(['min', 'comfortable', 'large']),
  disabled: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node.isRequired,
};

export default memo(TouchableArea);