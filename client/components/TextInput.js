/* eslint-disable import/no-named-as-default-member */
import React, { memo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput as Input } from 'react-native-paper';
import PropTypes from 'prop-types';
import { colors, spacing, borderRadius, sizes, typography } from '../theme';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  small: {
    marginVertical: spacing.xs,
  },
  medium: {
    marginVertical: spacing.sm,
  },
  large: {
    marginVertical: spacing.md,
  },
  label: {
    ...typography.body2,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  input: {
    backgroundColor: colors.background.default,
    minHeight: sizes.touch.comfortable,
  },
  multiline: {
    minHeight: 80,
  },
  inputError: {
    borderColor: colors.semantic.error,
  },
  inputContent: {
    ...typography.body1,
    paddingHorizontal: spacing.md,
  },
  outline: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  error: {
    ...typography.caption,
    color: colors.semantic.error,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});

/**
 * Enhanced TextInput component using design system
 * 
 * @param {Object} props
 * @param {string} props.label - Input label
 * @param {string} props.errorText - Error message to display
 * @param {boolean} props.multiline - Whether input is multiline
 * @param {'small'|'medium'|'large'} props.size - Input size variant
 * @param {Object} props.style - Additional styles for container
 * @param {Object} props.inputStyle - Additional styles for input
 */
function TextInput({ 
  label,
  errorText, 
  multiline = false,
  size = 'medium',
  style,
  inputStyle,
  ...props 
}) {
  const containerStyle = [
    styles.container,
    styles[size],
    style
  ];

  const textInputStyle = [
    styles.input,
    multiline && styles.multiline,
    errorText && styles.inputError,
    inputStyle
  ];

  return (
    <View style={containerStyle}>
      {label && (
        <Text style={styles.label} accessibilityRole="text">
          {label}
        </Text>
      )}
      
      <Input
        style={textInputStyle}
        selectionColor={colors.primary}
        underlineColor="transparent"
        activeUnderlineColor={colors.primary}
        outlineColor={errorText ? colors.semantic.error : colors.neutral[300]}
        activeOutlineColor={errorText ? colors.semantic.error : colors.primary}
        mode="outlined"
        multiline={multiline}
        contentStyle={styles.inputContent}
        outlineStyle={styles.outline}
        theme={{
          colors: {
            onSurfaceVariant: colors.text.secondary,
            onSurface: colors.text.primary,
          }
        }}
        accessibilityLabel={label}
        accessibilityHint={errorText ? `Error: ${errorText}` : undefined}
        {...props}
      />
      
      {errorText && (
        <Text style={styles.error} accessibilityRole="text">
          {errorText}
        </Text>
      )}
    </View>
  );
}

TextInput.propTypes = {
  label: PropTypes.string,
  errorText: PropTypes.string,
  multiline: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  inputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default memo(TextInput);
