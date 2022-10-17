import { get } from './request';

const queryAllMessageAsReceiver = async () => {
  const res = await get('api/v1/notifications');
  return res;
}

export default queryAllMessageAsReceiver;