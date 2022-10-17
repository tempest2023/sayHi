import { get } from './request';

const queryAllMessageBySenderId = async (senderId) => {
  const res = await get('api/v1/notifications', senderId);
  return res;
}

export default queryAllMessageBySenderId;