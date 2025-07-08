import React, { memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import theme from '../theme';

/**
 * Header component using design system typography
 * 
 * @param {Object} props
 * @param {'h1'|'h2'|'h3'|'h4'} props.variant - Typography variant
 * @param {boolean} props.center - Whether to center align text
 * @param {Object} props.style - Additional styles
 * @param {React.ReactNode} props.children - Header content
 */
function Header({ 
  variant = 'h2', 
  center = true,
  style, 
  children, 
  ...props 
}) {
  const headerStyle = [
    styles.base,
    theme.typography[variant],
    center && styles.center,
    style
  ];

  return (
    <Text 
      style={headerStyle} 
      accessibilityRole="header"
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    color: theme.colors.primary[500],
    paddingVertical: theme.spacing.md,
    includeFontPadding: false,
  },
  center: {
    textAlign: 'center',
  },
});

Header.propTypes = {
  variant: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4']),
  center: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node.isRequired,
};

export default memo(Header);
