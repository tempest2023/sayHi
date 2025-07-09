/* eslint-disable import/no-named-as-default-member */
import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import PropTypes from 'prop-types';
import { colors, spacing, borderRadius, shadows, sizes, typography } from '../theme';

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.md,
    minHeight: sizes.touch.comfortable,
    justifyContent: 'center',
    marginVertical: spacing.sm,
  },
  small: {
    paddingHorizontal: spacing.md,
    minHeight: sizes.touch.min,
  },
  medium: {
    paddingHorizontal: spacing.lg,
    minHeight: sizes.touch.comfortable,
    minWidth: 120,
  },
  large: {
    paddingHorizontal: spacing.xl,
    minHeight: sizes.touch.large,
    minWidth: 160,
  },
  fullWidth: {
    width: '100%',
  },
  contained: {
    backgroundColor: colors.primary,
    ...shadows.sm,
  },
  outlined: {
    backgroundColor: colors.background.default,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  text: {
    backgroundColor: 'transparent',
  },
  label: {
    fontWeight: '600',
    textTransform: 'none', // Override default uppercase
  },
});

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
    typography.button,
    styles.label,
    mode === 'text' && { color: colors.primary },
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

Button.propTypes = {
  mode: PropTypes.oneOf(['text', 'outlined', 'contained']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullWidth: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node.isRequired,
}

export default memo(Button);
