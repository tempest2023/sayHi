import { get } from './request';

const queryAllMessageAsSender = async () => {
  const res = await get('api/v1/messages');
  return res;
}

export default queryAllMessageAsSender;