import React, { memo } from 'react';
import { Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { typography, colors } from '../../theme';

// Move styles above the Typography component definition
const styles = StyleSheet.create({
  base: {},
  center: {
    textAlign: 'center',
  },
  h1: { ...typography.h1, color: colors.text.primary },
  h2: { ...typography.h2, color: colors.text.primary },
  h3: { ...typography.h3, color: colors.text.primary },
  h4: { ...typography.h4, color: colors.text.primary },
  body1: { ...typography.body1, color: colors.text.primary },
  body2: { ...typography.body2, color: colors.text.primary },
  caption: { ...typography.caption, color: colors.text.secondary },
  button: { ...typography.button, color: colors.text.primary },
  overline: { ...typography.overline, color: colors.text.secondary },
});

/**
 * Typography component that provides consistent text styling throughout the app
 * 
 * @param {Object} props
 * @param {'h1'|'h2'|'h3'|'h4'|'body1'|'body2'|'caption'|'button'|'overline'} props.variant - Typography variant
 * @param {'primary'|'secondary'|'disabled'|'inverse'} props.color - Text color variant
 * @param {boolean} props.center - Whether to center align text
 * @param {Object} props.style - Additional styles
 * @param {React.ReactNode} props.children - Text content
 */
function Typography({ 
  variant = 'body1', 
  color = 'primary', 
  center = false,
  style,
  accessibilityRole,
  ...props 
}) {
  const textStyle = [
    styles.base,
    typography[variant],
    { color: colors.text[color] },
    center && styles.center,
    style
  ];

  // Set appropriate accessibility role based on variant
  const getAccessibilityRole = () => {
    if (accessibilityRole) return accessibilityRole;
    if (variant.startsWith('h')) return 'header';
    return 'text';
  };

  return (
    <Text 
      style={textStyle} 
      accessibilityRole={getAccessibilityRole()}
      {...props}
    />
  );
}

Typography.propTypes = {
  variant: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'body1', 'body2', 'caption', 'button', 'overline']),
  color: PropTypes.oneOf(['primary', 'secondary', 'disabled', 'inverse']),
  center: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  accessibilityRole: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default memo(Typography);