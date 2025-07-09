import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Typography from '../atoms/Typography';
import Button from '../Button'; // Using existing button component
import { spacing } from '../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  iconContainer: {
    marginBottom: spacing.lg,
  },
  title: {
    marginBottom: spacing.md,
  },
  description: {
    marginBottom: spacing.xl,
    textAlign: 'center',
    lineHeight: 24,
  },
  action: {
    marginTop: spacing.md,
  },
});

/**
 * EmptyState component for displaying empty states with optional action
 * 
 * @param {Object} props
 * @param {string} props.icon - Icon name (optional)
 * @param {string} props.title - Main title text
 * @param {string} props.description - Description text
 * @param {string} props.actionText - Action button text (optional)
 * @param {Function} props.onAction - Action button handler (optional)
 * @param {Object} props.style - Additional styles
 */
function EmptyState({
  icon,
  title,
  description,
  actionText,
  onAction,
  style,
  ...props
}) {
  return (
    <View style={[styles.container, style]} {...props}>
      {icon && (
        <View style={styles.iconContainer}>
          {/* Could add icon rendering here if needed */}
        </View>
      )}
      
      <Typography
        variant="h3"
        color="primary"
        center
        style={styles.title}
      >
        {title}
      </Typography>
      
      <Typography
        variant="body1"
        color="secondary"
        center
        style={styles.description}
      >
        {description}
      </Typography>
      
      {actionText && onAction && (
        <Button
          mode="contained"
          onPress={onAction}
          style={styles.action}
        >
          {actionText}
        </Button>
      )}
    </View>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  actionText: PropTypes.string,
  onAction: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default memo(EmptyState);