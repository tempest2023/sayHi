import React, { memo, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import PropTypes from 'prop-types';
import TouchableArea from '../atoms/TouchableArea';
import Typography from '../atoms/Typography';
import { colors, spacing, borderRadius, shadows, typography } from '../../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.default,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...shadows.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  textInput: {
    flex: 1,
    maxHeight: 120,
    backgroundColor: colors.background.default,
  },
  inputContent: {
    ...typography.body1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  inputOutline: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  sendButton: {
    marginBottom: spacing.xs,
  },
  sendIconContainer: {
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  sendIconDisabled: {
    backgroundColor: colors.neutral[300],
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  charCount: {
    textAlign: 'right',
    marginTop: spacing.xs,
    marginRight: spacing.sm,
  },
});

/**
 * ChatInput organism component for sending messages
 * 
 * @param {Object} props
 * @param {Function} props.onSend - Send message handler
 * @param {boolean} props.sending - Whether a message is being sent
 * @param {string} props.placeholder - Input placeholder text
 * @param {boolean} props.disabled - Whether input is disabled
 * @param {Object} props.style - Additional styles
 */
function ChatInput({
  onSend,
  sending = false,
  placeholder = "Type a message...",
  disabled = false,
  style,
  ...props
}) {
  const [text, setText] = useState('');

  /**
   * Handle sending message
   */
  const handleSend = useCallback(async () => {
    if (!text.trim() || sending || disabled) return;
    
    const messageText = text.trim();
    setText(''); // Clear input immediately for better UX
    
    try {
      const success = await onSend(messageText);
      if (!success) {
        // Restore text if sending failed
        setText(messageText);
      }
    } catch (error) {
      // Restore text if sending failed
      setText(messageText);
    }
  }, [text, sending, disabled, onSend]);

  /**
   * Handle text change
   */
  const handleTextChange = useCallback((newText) => {
    setText(newText);
  }, []);

  /**
   * Handle submit editing (when user presses send button on keyboard)
   */
  const handleSubmitEditing = useCallback(() => {
    handleSend();
  }, [handleSend]);

  const isDisabled = disabled || sending || !text.trim();

  return (
    <View style={[styles.container, style]} {...props}>
      <View style={styles.inputContainer}>
        <TextInput
          value={text}
          onChangeText={handleTextChange}
          onSubmitEditing={handleSubmitEditing}
          placeholder={placeholder}
          multiline
          maxLength={500}
          style={styles.textInput}
          contentStyle={styles.inputContent}
          outlineStyle={styles.inputOutline}
          mode="outlined"
          theme={{
            colors: {
              outline: colors.neutral[300],
              outlineVariant: colors.neutral[200],
              onSurfaceVariant: colors.text.secondary,
              onSurface: colors.text.primary,
            }
          }}
          accessibilityLabel="Message input"
          accessibilityHint="Type your message and press send"
          blurOnSubmit={false}
          returnKeyType="send"
          editable={!disabled}
        />
        
        <TouchableArea
          onPress={handleSend}
          disabled={isDisabled}
          accessibilityLabel="Send message"
          accessibilityHint={
            isDisabled 
              ? "Disabled - type a message to enable" 
              : "Send the message"
          }
          style={[
            styles.sendButton,
            isDisabled && styles.sendButtonDisabled
          ]}
          touchSize="comfortable"
        >
          <View style={[
            styles.sendIconContainer,
            isDisabled && styles.sendIconDisabled
          ]}>
            <Typography
              variant="button"
              color={isDisabled ? "disabled" : "inverse"}
              style={styles.sendText}
            >
              {sending ? "..." : "Send"}
            </Typography>
          </View>
        </TouchableArea>
      </View>
      
      {text.length > 400 && (
        <Typography
          variant="caption"
          color={text.length > 480 ? "error" : "secondary"}
          style={styles.charCount}
        >
          {text.length}/500
        </Typography>
      )}
    </View>
  );
}

ChatInput.propTypes = {
  onSend: PropTypes.func.isRequired,
  sending: PropTypes.bool,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default memo(ChatInput);