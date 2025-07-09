/* eslint-disable import/no-named-as-default-member */
import React, { memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import { colors, spacing, typography } from '../theme';

const styles = StyleSheet.create({
  base: {
    marginBottom: spacing.md,
    includeFontPadding: false,
  },
  center: {
    textAlign: 'center',
  },
});

/**
 * Paragraph component using design system typography
 * 
 * @param {Object} props
 * @param {'body1'|'body2'|'caption'} props.variant - Typography variant
 * @param {'primary'|'secondary'|'disabled'} props.color - Text color variant
 * @param {boolean} props.center - Whether to center align text
 * @param {Object} props.style - Additional styles
 * @param {React.ReactNode} props.children - Paragraph content
 */
function Paragraph({ 
  variant = 'body1', 
  color = 'secondary',
  center = true,
  style, 
  children, 
  ...props 
}) {
  const textStyle = [
    styles.base,
    typography[variant],
    { color: colors.text[color] },
    center && styles.center,
    style
  ];

  return (
    <Text 
      style={textStyle} 
      accessibilityRole="text"
      {...props}
    >
      {children}
    </Text>
  );
}

Paragraph.propTypes = {
  variant: PropTypes.oneOf(['body1', 'body2', 'caption']),
  color: PropTypes.oneOf(['primary', 'secondary', 'disabled']),
  center: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node.isRequired,
};

export default memo(Paragraph);
