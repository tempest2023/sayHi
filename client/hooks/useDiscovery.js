import { useState, useEffect, useCallback } from 'react';
import randomPickUp from '../apis/pickup';
import { getData } from '../apis/localStorage';

/**
 * Custom hook for managing user discovery functionality
 * 
 * @returns {Object} Discovery state and operations
 */
function useDiscovery() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch random user, excluding current user
   */
  const fetchRandomUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const currentUserId = await getData('userid');
      if (!currentUserId) {
        throw new Error('User not logged in or userid not found');
      }

      const res = await randomPickUp();
      if (!res || !res.success || !res.data || res.data.length === 0) {
        throw new Error(res?.errmsg || 'Failed to fetch users');
      }

      const fetchedUser = res.data[0];

      if (fetchedUser.userid === currentUserId) {
        setCurrentUser(null);
        return null;
      }

      const userWithDisplayName = {
        ...fetchedUser,
        displayName: fetchedUser.realname || fetchedUser.username || 'Unknown User'
      };
      setCurrentUser(userWithDisplayName);
      return userWithDisplayName;
    } catch (err) {
      console.log('[useDiscovery] Error fetching user:', err);
      setError(err.message || 'Failed to load new people');
      setCurrentUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Skip current user and get next one
   */
  const skipUser = useCallback(async () => {
    await fetchRandomUser();
  }, [fetchRandomUser]);

  /**
   * Retry on error
   */
  const retry = useCallback(() => {
    fetchRandomUser();
  }, [fetchRandomUser]);

  /**
   * Check if user data is valid
   */
  const isValidUser = useCallback((user) => user && user.userid && user.userid !== 'undefined', []);

  // Load initial user on mount (only once)
  useEffect(() => {
    fetchRandomUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    currentUser,
    loading,
    error,
    skipUser,
    retry,
    isValidUser,
    refetchUser: fetchRandomUser,
  };
}

export default useDiscovery;