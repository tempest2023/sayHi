import { useState, useEffect, useCallback } from 'react';
import queryFriends from '../apis/queryFriends';
import queryFriendsInfo from '../apis/queryFriendsInfo';

/**
 * Custom hook for managing friends data and operations
 * 
 * @returns {Object} Friends state and operations
 */
function useFriends() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Fetch friends list with their detailed information
   */
  const fetchFriends = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Get friends list (user IDs)
      const friendsList = await queryFriends();
      
      if (!friendsList || friendsList.length === 0) {
        setFriends([]);
        return;
      }

      // Get detailed info for each friend
      const friendsInfoList = await queryFriendsInfo(friendsList);
      
      // Check for errors in the response
      const errorRes = friendsInfoList.filter(item => !item || !item.success);
      if (errorRes.length > 0) {
        throw new Error(errorRes[0]?.errmsg || 'Failed to load friends information');
      }

      // Extract and set friends data
      const friendsData = friendsInfoList.map(item => ({
        ...item.data,
        // Add any additional computed properties here
        displayName: item.data.realname || item.data.username || 'Unknown',
        isOnline: Math.random() > 0.5, // Mock online status - replace with real data
      }));

      setFriends(friendsData);
    } catch (err) {
      console.error('[useFriends] Error fetching friends:', err);
      setError(err.message || 'Failed to load friends');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  /**
   * Refresh friends list
   */
  const refreshFriends = useCallback(() => {
    fetchFriends(true);
  }, [fetchFriends]);

  /**
   * Get friend by user ID
   */
  const getFriendById = useCallback((userId) => friends.find(friend => friend.userid === userId), [friends]);

  /**
   * Check if user is in friends list
   */
  const isFriend = useCallback((userId) => friends.some(friend => friend.userid === userId), [friends]);

  // Load friends on mount
  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  return {
    friends,
    loading,
    error,
    refreshing,
    refreshFriends,
    getFriendById,
    isFriend,
    refetch: fetchFriends,
  };
}

export default useFriends;