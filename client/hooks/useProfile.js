import { useState, useEffect, useCallback } from 'react';
import { emailValidator, nameValidator, ageValidator, genderValidator, usernameValidator } from '../utils';
import checkUserAuth from '../apis/checkUserAuth';
import updateProfile from '../apis/updateProfile';
import { saveData, secureSave } from '../apis/localStorage';

/**
 * Custom hook for managing user profile functionality
 * 
 * @returns {Object} Profile state and operations
 */
function useProfile() {
  const [profile, setProfile] = useState({
    avatar: null,
    username: '',
    realname: '',
    email: '',
    gender: '',
    age: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  /**
   * Load user profile data
   */
  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setErrors({});
      
      const res = await checkUserAuth();
      if (!res || !res.success) {
        throw new Error('Authentication failed');
      }
      
      const { data = {} } = res;
      
      setProfile({
        avatar: data.avatar || null,
        username: data.username || '',
        realname: data.realname || '',
        email: data.email || '',
        gender: data.gender || '',
        age: data.age ? String(data.age) : '',
      });
    } catch (err) {
      console.error('[useProfile] Error loading profile:', err);
      throw err; // Re-throw to handle in component
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update a single field value
   */
  const updateField = useCallback((field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  }, [errors]);

  /**
   * Validate all form fields
   */
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    const emailError = emailValidator(profile.email);
    if (emailError) {
      newErrors.email = emailError;
    }
    
    const usernameError = usernameValidator(profile.username);
    if (usernameError) {
      newErrors.username = usernameError;
    }
    
    const realnameError = nameValidator(profile.realname);
    if (realnameError) {
      newErrors.realname = realnameError;
    }
    
    const genderError = genderValidator(profile.gender);
    if (genderError) {
      newErrors.gender = genderError;
    }
    
    const ageError = ageValidator(profile.age);
    if (ageError) {
      newErrors.age = ageError;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [profile]);

  /**
   * Save profile data
   */
  const saveProfile = useCallback(async () => {
    if (!validateForm()) {
      return { success: false, message: 'Please fix the errors above' };
    }
    
    try {
      setSaving(true);
      
      const result = await updateProfile({
        username: profile.username,
        realname: profile.realname,
        email: profile.email,
        gender: profile.gender,
        age: parseInt(profile.age, 10),
      });
      
      if (!result || !result.success) {
        return { 
          success: false, 
          message: result?.errmsg || 'Failed to update profile' 
        };
      }
      
      return { success: true, message: 'Profile updated successfully!' };
    } catch (error) {
      console.error('[useProfile] Error saving profile:', error);
      return { 
        success: false, 
        message: 'Failed to update profile. Please try again.' 
      };
    } finally {
      setSaving(false);
    }
  }, [profile, validateForm]);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      await saveData('userid', '');
      await secureSave('token', '');
      return true;
    } catch (error) {
      console.error('[useProfile] Error during logout:', error);
      return false;
    }
  }, []);

  /**
   * Get display name for user
   */
  const getDisplayName = useCallback(() => profile.realname || profile.username || 'User', [profile.realname, profile.username]);

  // Load profile on mount
  useEffect(() => {
    loadProfile().catch(err => {
      // Handle authentication errors in component
      console.error('[useProfile] Failed to load profile:', err);
    });
  }, [loadProfile]);

  return {
    profile,
    loading,
    saving,
    errors,
    updateField,
    saveProfile,
    logout,
    getDisplayName,
    loadProfile,
  };
}

export default useProfile;