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
      
      const res = await randomPickUp();
      if (!res || !res.success) {
        throw new Error(res?.errmsg || 'Failed to fetch users');
      }
      
      const currentUserId = await getData('userid');
      const fetchedUser = res.data[0];
      
      // If we got our own profile, try again
      if (fetchedUser.userid === currentUserId) {
        const nextUser = await fetchRandomUser();
        return nextUser;
      }
      
      // Add display name for easier use
      const userWithDisplayName = {
        ...fetchedUser,
        displayName: fetchedUser.realname || fetchedUser.username || 'Unknown User'
      };
      
      setCurrentUser(userWithDisplayName);
      return userWithDisplayName;
    } catch (err) {
      console.error('[useDiscovery] Error fetching user:', err);
      setError(err.message || 'Failed to load new people');
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

  // Load initial user on mount
  useEffect(() => {
    fetchRandomUser();
  }, [fetchRandomUser]);

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