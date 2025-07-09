import React, { memo, useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import PropTypes from 'prop-types';
import MessageBubble from '../molecules/MessageBubble';
import EmptyState from '../molecules/EmptyState';
import Typography from '../atoms/Typography';
import { colors, spacing } from '../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.default,
    paddingHorizontal: spacing.xl,
  },
  list: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  listContent: {
    paddingVertical: spacing.md,
    flexGrow: 1,
  },
  loadingText: {
    marginTop: spacing.md,
  },
});

/**
 * MessageList organism component with optimized FlatList rendering for chat messages
 * 
 * @param {Object} props
 * @param {Array} props.messages - Array of message objects
 * @param {boolean} props.loading - Loading state
 * @param {string} props.error - Error message
 * @param {Function} props.onRetry - Retry handler for errors
 * @param {string} props.userAvatar - Current user's avatar
 * @param {string} props.otherAvatar - Chat partner's avatar
 * @param {Function} props.onLoadMore - Load more messages handler
 * @param {Object} props.style - Additional styles
 */
function MessageList({
  messages = [],
  loading = false,
  error = null,
  onRetry,
  userAvatar,
  otherAvatar,
  onLoadMore,
  style,
  ...props
}) {
  /**
   * Render individual message item with optimization
   */
  const renderMessage = useCallback(({ item }) => (
    <MessageBubble
      message={item}
      isOwn={item.sender === 'me'}
      userAvatar={userAvatar}
      otherAvatar={otherAvatar}
    />
  ), [userAvatar, otherAvatar]);

  /**
   * Key extractor for FlatList optimization
   */
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  /**
   * Render loading state
   */
  if (loading && messages.length === 0) {
    return (
      <View style={[styles.centerContainer, style]}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Typography
          variant="body1"
          color="secondary"
          center
          style={styles.loadingText}
        >
          Loading messages...
        </Typography>
      </View>
    );
  }

  /**
   * Render error state
   */
  if (error) {
    return (
      <View style={[styles.container, style]}>
        <EmptyState
          title="Failed to load messages"
          description={error}
          actionText="Try Again"
          onAction={onRetry}
        />
      </View>
    );
  }

  /**
   * Render empty state
   */
  if (messages.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <EmptyState
          title="No messages yet"
          description="Start the conversation by sending a message below!"
        />
      </View>
    );
  }

  /**
   * Render messages list
   */
  return (
    <FlatList
      data={messages}
      renderItem={renderMessage}
      keyExtractor={keyExtractor}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.1}
      showsVerticalScrollIndicator={false}
      style={[styles.list, style]}
      contentContainerStyle={styles.listContent}
      inverted={false} // Keep messages in chronological order
      removeClippedSubviews
      maxToRenderPerBatch={20}
      updateCellsBatchingPeriod={50}
      initialNumToRender={20}
      windowSize={10}
      getItemLayout={(data, index) => ({
        length: 80, // Approximate message height
        offset: 80 * index,
        index,
      })}
      {...props}
    />
  );
}

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    text: PropTypes.string.isRequired,
    sender: PropTypes.string.isRequired,
    time: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })),
  loading: PropTypes.bool,
  error: PropTypes.string,
  onRetry: PropTypes.func,
  userAvatar: PropTypes.string,
  otherAvatar: PropTypes.string,
  onLoadMore: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default memo(MessageList);