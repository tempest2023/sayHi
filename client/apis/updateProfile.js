import { put } from './request';
import { sha256 } from '../utils';
import { getData } from './localStorage';

const updateProfile = async ({ username, password, realname, age, gender, email }) => {
  
  const params = {
    "username": username,
    "realname": realname,
    "age": age,
    "gender": gender,
    "email": email,
  };
  if(!password) {
    params.password = await sha256(password);
  }
  const userid = await getData('userid'); // non-sensitive data
  console.log('[update profile]', params)
  const res = await put('api/v1/users', userid, params)
  return res;
}

export default updateProfile;