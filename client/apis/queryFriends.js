import { get } from './request';

const queryFriends = async () => {
  const res = new Set();
  const asSender = await get('api/v1/messages');
  if (asSender && asSender.success) {
    const { data = [] } = asSender;
    data.forEach(item => {
      const { receiver_userid: receiverUserId } = item;
      res.add(receiverUserId);
    })
  }
  const asReceiver = await get('api/v1/notifications');
  if (asReceiver && asReceiver.success) {
    const { data = [] } = asReceiver;
    data.forEach(item => {
      const { userid } = item;
      res.add(userid);
    });
  }
  return Array.from(res);
}

export default queryFriends;