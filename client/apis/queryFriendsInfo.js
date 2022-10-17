import { get } from './request';

const queryFriendsInfo = async (friendlist) => {
  const requestList = [];
  friendlist.forEach(userid => {
    requestList.push(get('api/v1/users', userid));
  })
  const res = await Promise.all(requestList);
  return res;
}

export default queryFriendsInfo;