import { get } from './request';

const queryAllMessageByReceiverId = async (receiverId) => {
  const res = await get('api/v1/messages', receiverId);
  return res;
}

export default queryAllMessageByReceiverId;