import { get } from './request';

const queryLatestMessageAsSender = async () => {
  const res = await get('api/v1/messages/new');
  return res;
}

export default queryLatestMessageAsSender;