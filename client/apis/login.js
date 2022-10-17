import { post } from './request';
import { sha256 } from '../utils';

const login = async (email, password) => {
  const cipher = await sha256(password);
  const params = {
    "email": email,
    "password": cipher
  };
  const res = await post('login', params)
  return res;
}

export default login;