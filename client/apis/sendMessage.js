import { post } from './request';

const sendMessage = async (message, receiverUserid) => {
  const res = await post('api/v1/messages', {
    message,
    receiver_userid: receiverUserid
  });
  return res;
}

export default sendMessage;