import React, { memo } from 'react';
import { Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import theme from '../../theme';

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
    theme.typography[variant],
    { color: theme.colors.text[color] },
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

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false, // Android specific - removes extra padding
  },
  center: {
    textAlign: 'center',
  }
});

Typography.propTypes = {
  variant: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'body1', 'body2', 'caption', 'button', 'overline']),
  color: PropTypes.oneOf(['primary', 'secondary', 'disabled', 'inverse']),
  center: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  accessibilityRole: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default memo(Typography);