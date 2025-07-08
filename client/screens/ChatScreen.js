import React, { memo, useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Background from '../components/Background';
import Header from '../components/Header';
import MessageList from '../components/organisms/MessageList';
import ChatInput from '../components/organisms/ChatInput';
import MsgModal, { showModal, hideModal } from '../components/MsgModal';
import useChat from '../hooks/useChat';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[200],
    backgroundColor: theme.colors.background.default,
    ...theme.shadows.sm,
  },
  messageList: {
    flex: 1,
  },
  chatInput: {
    // Input styles handled by ChatInput component
  },
});

/**
 * Refactored ChatScreen with clean architecture:
 * - Separated data logic into useChat hook
 * - UI decomposed into MessageList and ChatInput organisms
 * - Performance optimized with FlatList
 * - Improved accessibility and error handling
 * - Modern design system implementation
 */
function ChatScreen({ navigation, route }) {
  // Extract userId from route params
  const { userid } = route.params || {};
  
  // Data and business logic handled by custom hook
  const {
    messages,
    loading,
    sending,
    error,
    myInfo,
    receiverInfo,
    sendMessage,
    retry,
  } = useChat(userid);

  // Modal state for error handling
  const [visible, setVisible] = React.useState(false);
  const [modalTitle, setModalTitle] = React.useState('');
  const [modalMessage, setModalMessage] = React.useState('');

  /**
   * Validate route params on mount
   */
  useEffect(() => {
    if (!userid) {
      setModalTitle('Error');
      setModalMessage('Invalid chat session. Please try again.');
      showModal(setVisible);
    }
  }, [userid]);

  /**
   * Handle message sending with error handling
   */
  const handleSendMessage = useCallback(async (text) => {
    try {
      const success = await sendMessage(text);
      if (!success) {
        setModalTitle('Error');
        setModalMessage('Failed to send message. Please try again.');
        showModal(setVisible);
      }
      return success;
    } catch (error) {
      setModalTitle('Error');
      setModalMessage('Failed to send message. Please try again.');
      showModal(setVisible);
      return false;
    }
  }, [sendMessage]);

  /**
   * Handle retry for errors
   */
  const handleRetry = useCallback(() => {
    retry();
  }, [retry]);

  /**
   * Handle modal close
   */
  const handleModalClose = useCallback(() => {
    hideModal(setVisible);
    // If there's a critical error, go back
    if (!userid || (error && !receiverInfo)) {
      navigation.goBack();
    }
  }, [userid, error, receiverInfo, navigation]);

  /**
   * Get chat partner display name
   */
  const chatPartnerName = receiverInfo?.realname || receiverInfo?.username || 'Unknown User';

  return (
    <Background style={styles.container}>
      {/* Error Modal */}
      <MsgModal
        title={modalTitle}
        msg={modalMessage}
        type="normal"
        okText="Got it"
        okCallback={handleModalClose}
        visible={visible}
      />

      {/* Chat Header */}
      {receiverInfo && (
        <Header variant="h3" style={styles.header}>
          {chatPartnerName}
        </Header>
      )}

      {/* Messages List */}
      <MessageList
        messages={messages}
        loading={loading}
        error={error}
        onRetry={handleRetry}
        userAvatar={myInfo?.avatar}
        otherAvatar={receiverInfo?.avatar}
        style={styles.messageList}
      />

      {/* Message Input */}
      <ChatInput
        onSend={handleSendMessage}
        sending={sending}
        disabled={!receiverInfo || !!error}
        style={styles.chatInput}
      />
    </Background>
  );
}


ChatScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
}

export default memo(ChatScreen);
