import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import PropTypes from 'prop-types';
import theme from '../theme';

/**
 * Enhanced Button component following design system
 * 
 * @param {Object} props
 * @param {'text'|'outlined'|'contained'} props.mode - Button style variant
 * @param {'small'|'medium'|'large'} props.size - Button size
 * @param {boolean} props.fullWidth - Whether button should take full width
 * @param {Object} props.style - Additional styles
 * @param {React.ReactNode} props.children - Button content
 */
function Button({ 
  mode = 'contained', 
  size = 'medium', 
  fullWidth = false,
  style, 
  children, 
  ...props 
}) {
  const buttonStyles = [
    styles.base,
    styles[size],
    fullWidth && styles.fullWidth,
    mode === 'outlined' && styles.outlined,
    mode === 'contained' && styles.contained,
    mode === 'text' && styles.text,
    style,
  ];

  const labelStyles = [
    theme.typography.button,
    styles.label,
    mode === 'text' && { color: theme.colors.primary[500] },
  ];

  return (
    <PaperButton
      style={buttonStyles}
      labelStyle={labelStyles}
      mode={mode}
      {...props}
    >
      {children}
    </PaperButton>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.borderRadius.md,
    minHeight: theme.sizes.touch.comfortable,
    justifyContent: 'center',
    marginVertical: theme.spacing.sm,
  },
  small: {
    paddingHorizontal: theme.spacing.md,
    minHeight: theme.sizes.touch.min,
  },
  medium: {
    paddingHorizontal: theme.spacing.lg,
    minHeight: theme.sizes.touch.comfortable,
    minWidth: 120,
  },
  large: {
    paddingHorizontal: theme.spacing.xl,
    minHeight: theme.sizes.touch.large,
    minWidth: 160,
  },
  fullWidth: {
    width: '100%',
  },
  contained: {
    backgroundColor: theme.colors.primary[500],
    ...theme.shadows.sm,
  },
  outlined: {
    backgroundColor: theme.colors.background.default,
    borderWidth: 1,
    borderColor: theme.colors.primary[500],
  },
  text: {
    backgroundColor: 'transparent',
  },
  label: {
    fontWeight: '600',
    textTransform: 'none', // Override default uppercase
  },
});

Button.propTypes = {
  mode: PropTypes.oneOf(['text', 'outlined', 'contained']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullWidth: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node.isRequired,
}

export default memo(Button);
