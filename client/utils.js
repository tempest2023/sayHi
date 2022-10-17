import { Platform } from 'react-native'

export const sha256 = async (text)=>{
  async function digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }
  return digestMessage(text);
}

export const emailValidator = (email) => {
  const re = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) return 'Email cannot be empty.';
  if (!re.test(email)) return 'Ooops! We need a valid email address.';

  return '';
};

export const passwordValidator = (password) => {
  if (!password || password.length <= 0) return 'Password cannot be empty.';

  return '';
};

export const nameValidator = (name) => {
  if (!name || name.length <= 0) return 'Name cannot be empty.';

  return '';
};

export const ageValidator = (age) => {
  if(!age || parseInt(age, 10)<=0 || parseInt(age, 10) >= 150) return 'Age cannot be empty or invalid.';

  return '';
}

export const genderValidator = (gender) => {
  if(!gender) return 'Gender cannot be empty.';

  return '';
}

export const usernameValidator = (username) => {
  if (!username || username.length <= 0) return 'Username cannot be empty.';
  if (username.length > 15) return 'Username must be at most 15 characters.';
  if (username.length < 7) return 'Username must be at least 7 characters.';
  return '';
}

export const isJsonObject = (value) => Object.prototype.toString.call(value) === '[object Object]' || Object.prototype.toString.call(value) === '[object Array]'

export const isWeb = () => !(Platform.OS === 'android' || Platform.OS === 'ios');
export const isiOS = () => Platform.OS === 'ios';
export const isAndroid = () => Platform.OS === 'android';