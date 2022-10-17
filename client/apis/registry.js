import { post } from './request';
import { sha256 } from '../utils';

const registry = async (email, password, realname) => {
  const cipher = await sha256(password);
  const params = {
    "email": email,
    "password": cipher,
    "realname": realname
  };
  const res = await post('api/v1/users', params)
  return res;
}

export default registry;