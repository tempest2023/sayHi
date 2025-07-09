import React, { memo, useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import PropTypes from 'prop-types';
import ChatListItem from '../molecules/ChatListItem';
import EmptyState from '../molecules/EmptyState';
import Typography from '../atoms/Typography';
import { colors, spacing, sizes } from '../../theme';

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
  emptyContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.neutral[200],
    marginLeft: spacing.md + sizes.avatar.lg + spacing.md, // Align with text
  },
  loadingText: {
    marginTop: spacing.md,
  },
});

/**
 * FriendsList organism component with optimized FlatList rendering
 * 
 * @param {Object} props
 * @param {Array} props.friends - Array of friend objects
 * @param {boolean} props.loading - Loading state
 * @param {string} props.error - Error message
 * @param {boolean} props.refreshing - Refreshing state
 * @param {Function} props.onRefresh - Refresh handler
 * @param {Function} props.onFriendPress - Friend press handler
 * @param {Function} props.onEmptyAction - Empty state action handler
 * @param {Object} props.style - Additional styles
 */
function FriendsList({
  friends = [],
  loading = false,
  error = null,
  refreshing = false,
  onRefresh,
  onFriendPress,
  onEmptyAction,
  style,
  ...props
}) {
  /**
   * Render individual friend item with optimization
   */
  const renderFriendItem = useCallback(({ item }) => (
    <ChatListItem
      user={item}
      lastMessage="New Message Here!" // Mock message - replace with real data
      onPress={onFriendPress}
    />
  ), [onFriendPress]);

  /**
   * Key extractor for FlatList optimization
   */
  const keyExtractor = useCallback((item) => `friend_${item.userid}`, []);

  /**
   * Render separator between items
   */
  const renderSeparator = useCallback(() => (
    <View style={styles.separator} />
  ), []);

  /**
   * Render loading state
   */
  if (loading && !refreshing) {
    return (
      <View style={[styles.centerContainer, style]}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Typography
          variant="body1"
          color="secondary"
          center
          style={styles.loadingText}
        >
          Loading friends...
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
          title="Oops! Something went wrong"
          description={error}
          actionText="Try Again"
          onAction={onRefresh}
        />
      </View>
    );
  }

  /**
   * Render empty state
   */
  if (friends.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <EmptyState
          title="No Friends Yet"
          description="You haven't connected with anyone yet. Try discovering new people in the Pick tab to start building your social network!"
          actionText="Discover People"
          onAction={onEmptyAction}
        />
      </View>
    );
  }

  /**
   * Render friends list
   */
  return (
    <FlatList
      data={friends}
      renderItem={renderFriendItem}
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={renderSeparator}
      onRefresh={onRefresh}
      refreshing={refreshing}
      showsVerticalScrollIndicator={false}
      style={[styles.list, style]}
      contentContainerStyle={friends.length === 0 ? styles.emptyContentContainer : undefined}
      removeClippedSubviews
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={15}
      windowSize={10}
      getItemLayout={(data, index) => ({
        length: 72, // Approximate item height
        offset: 72 * index,
        index,
      })}
      {...props}
    />
  );
}

FriendsList.propTypes = {
  friends: PropTypes.arrayOf(PropTypes.shape({
    userid: PropTypes.string.isRequired,
    username: PropTypes.string,
    realname: PropTypes.string,
    avatar: PropTypes.string,
    isOnline: PropTypes.bool,
  })),
  loading: PropTypes.bool,
  error: PropTypes.string,
  refreshing: PropTypes.bool,
  onRefresh: PropTypes.func,
  onFriendPress: PropTypes.func.isRequired,
  onEmptyAction: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default memo(FriendsList);