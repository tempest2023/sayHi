import { useState, useEffect, useCallback } from 'react';
import sendMessage from '../apis/sendMessage';
import queryFriendsInfo from '../apis/queryFriendsInfo';
import queryAllMessageBySenderId from '../apis/queryAllMessageBySenderId';
import queryAllMessageByReceiverId from '../apis/queryAllMessageByReceiverId';
import checkUserAuth from '../apis/checkUserAuth';

/**
 * Custom hook for managing chat functionality
 * 
 * @param {string} receiverId - ID of the user we're chatting with
 * @returns {Object} Chat state and operations
 */
function useChat(receiverId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [myInfo, setMyInfo] = useState(null);
  const [receiverInfo, setReceiverInfo] = useState(null);

  /**
   * Load user information (current user and chat partner)
   */
  const loadUserInfo = useCallback(async () => {
    try {
      setError(null);
      
      // Get receiver info
      const friendsInfoList = await queryFriendsInfo([receiverId]);
      if (friendsInfoList.length < 1 || !friendsInfoList[0] || !friendsInfoList[0].success) {
        throw new Error('Failed to load chat partner information');
      }
      const { data: receiverData } = friendsInfoList[0];
      
      // Get current user info
      const userRes = await checkUserAuth();
      if (!userRes || !userRes.success) {
        throw new Error('Failed to load user information');
      }
      const { data: userData = {} } = userRes;
      
      setMyInfo(userData);
      setReceiverInfo(receiverData);
    } catch (err) {
      console.error('[useChat] Error loading user info:', err);
      setError(err.message || 'Failed to load user information');
    }
  }, [receiverId]);

  /**
   * Load chat message history
   */
  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const allMessages = [];
      
      // Get sent messages
      const sentMessageRes = await queryAllMessageByReceiverId(receiverId);
      if (!sentMessageRes || !sentMessageRes.success) {
        throw new Error(sentMessageRes?.errmsg || 'Failed to load sent messages');
      }
      const sentMessages = sentMessageRes.data || [];
      
      // Get received messages  
      const receivedMessageRes = await queryAllMessageBySenderId(receiverId);
      const receivedMessages = receivedMessageRes?.data || [];
      
      // Process sent messages
      sentMessages.forEach((item) => {
        allMessages.push({
          id: `sent_${item.id}`,
          sender: 'me',
          text: item.message,
          time: item.edit_time,
        });
      });
      
      // Process received messages
      receivedMessages.forEach((item) => {
        allMessages.push({
          id: `received_${item.id}`,
          sender: 'other',
          text: item.message,
          time: item.edit_time,
        });
      });
      
      // Sort messages by time
      allMessages.sort((a, b) => parseInt(a.time, 10) - parseInt(b.time, 10));
      
      setMessages(allMessages);
    } catch (err) {
      console.error('[useChat] Error loading messages:', err);
      setError(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [receiverId]);

  /**
   * Send a new message
   */
  const sendNewMessage = useCallback(async (text) => {
    if (!text.trim()) return false;
    
    try {
      setSending(true);
      setError(null);
      
      const result = await sendMessage(text.trim(), receiverId);
      if (!result || !result.success) {
        throw new Error(result?.errmsg || 'Failed to send message');
      }
      
      // Add message to local state immediately for better UX
      const newMessage = {
        id: `temp_${Date.now()}`,
        sender: 'me',
        text: text.trim(),
        time: Date.now().toString(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      return true;
    } catch (err) {
      console.error('[useChat] Error sending message:', err);
      setError(err.message || 'Failed to send message');
      return false;
    } finally {
      setSending(false);
    }
  }, [receiverId]);

  /**
   * Retry loading if there was an error
   */
  const retry = useCallback(() => {
    if (!myInfo || !receiverInfo) {
      loadUserInfo();
    }
    loadMessages();
  }, [loadUserInfo, loadMessages, myInfo, receiverInfo]);

  // Load user info when receiverId changes
  useEffect(() => {
    if (receiverId) {
      loadUserInfo();
    }
  }, [receiverId, loadUserInfo]);

  // Load messages when user info is available
  useEffect(() => {
    if (receiverId && myInfo && receiverInfo) {
      loadMessages();
    }
  }, [receiverId, myInfo, receiverInfo, loadMessages]);

  return {
    messages,
    loading,
    sending,
    error,
    myInfo,
    receiverInfo,
    sendMessage: sendNewMessage,
    retry,
    refreshMessages: loadMessages,
  };
}

export default useChat;