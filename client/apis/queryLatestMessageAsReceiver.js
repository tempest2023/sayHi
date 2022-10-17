import { get } from './request';

const queryLatestMessageAsReceiver = async () => {
  const res = await get('api/v1/notifications/new');
  return res;
}

export default queryLatestMessageAsReceiver;