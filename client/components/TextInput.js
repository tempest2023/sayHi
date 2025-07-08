import React, { memo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput as Input } from 'react-native-paper';
import PropTypes from 'prop-types';
import theme from '../theme';

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
        selectionColor={theme.colors.primary[500]}
        underlineColor="transparent"
        activeUnderlineColor={theme.colors.primary[500]}
        outlineColor={errorText ? theme.colors.semantic.error : theme.colors.neutral[300]}
        activeOutlineColor={errorText ? theme.colors.semantic.error : theme.colors.primary[500]}
        mode="outlined"
        multiline={multiline}
        contentStyle={styles.inputContent}
        outlineStyle={styles.outline}
        theme={{
          colors: {
            onSurfaceVariant: theme.colors.text.secondary,
            onSurface: theme.colors.text.primary,
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

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  small: {
    marginVertical: theme.spacing.xs,
  },
  medium: {
    marginVertical: theme.spacing.sm,
  },
  large: {
    marginVertical: theme.spacing.md,
  },
  label: {
    ...theme.typography.body2,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.background.default,
    minHeight: theme.sizes.touch.comfortable,
  },
  multiline: {
    minHeight: 80,
  },
  inputError: {
    borderColor: theme.colors.semantic.error,
  },
  inputContent: {
    ...theme.typography.body1,
    paddingHorizontal: theme.spacing.md,
  },
  outline: {
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
  },
  error: {
    ...theme.typography.caption,
    color: theme.colors.semantic.error,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
});

TextInput.propTypes = {
  label: PropTypes.string,
  errorText: PropTypes.string,
  multiline: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  inputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default memo(TextInput);
