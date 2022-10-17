import { get } from './request';
import { getData } from './localStorage';

const checkUserAuth = async () => {
  const userid = await getData('userid');
  if(!userid) {
    return {succes: false, errmsg: 'no userid'};
  }
  const res = await get('api/v1/users', userid)
  return res;
}

export default checkUserAuth;