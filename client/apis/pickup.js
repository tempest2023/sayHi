import { get } from './request';

const pickup = async () => {
  const res = await get('randomPickUsers');
  return res;
}

export default pickup;