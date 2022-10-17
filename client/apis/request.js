import { saveData, getData, secureGet, secureSave } from './localStorage';

const baseUrl = "http://127.0.0.1:7001/";
// const baseUrl = "server ip";

const mountToken = async (header) => {
  // add token and userid to parmas, if this request needs autorization.
  const userid = await getData('userid'); // non-sensitive data
  const token = await secureGet('token'); // sensitive data
  if(userid && token) {
    header.append('X-Userid', userid);
    header.append('X-Token', token);
    header.append('X-Token-TimeStamp', String(new Date().getTime()));
  }
}

export const post = async (api, body) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  await mountToken(myHeaders);
  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(body),
    redirect: 'follow'
  };
  console.log('[debug] post', baseUrl+api, requestOptions);
  return fetch(baseUrl + api, requestOptions)
    .then(response => response.json())
    .catch(error => console.warn(`[debug] ${api} post error: ${error}`));
}

export const get = async (api, id) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  await mountToken(myHeaders);
  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  // add url id
  let paramsApi = api;
  if(id) {
    paramsApi = (api.slice(-1) === '/') ? `${api}:${id}` : `${api}/:${id}`;
  }
  console.log('[debug] get', baseUrl+paramsApi, requestOptions);
  return fetch(baseUrl + paramsApi, requestOptions)
    .then(response => response.json())
    .catch(error => console.warn(`[debug] ${paramsApi} get error: ${error}`));
}

export const put = async (api, id, body) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  await mountToken(myHeaders);
  // add url id
  const paramsApi = api.slice(-1) === '/' ? `${api}:${id}` : `${api}/:${id}`;
  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: JSON.stringify(body),
    redirect: 'follow'
  };
  console.log('[debug] put', baseUrl+paramsApi, requestOptions);
  return fetch(baseUrl + paramsApi, requestOptions)
    .then(response => response.json())
    .catch(error => console.warn(`[debug] ${paramsApi} put error: ${error}`));
}

export const del = async (api, id, body) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  await mountToken(myHeaders);
  // add url id
  const paramsApi = api.slice(-1) === '/' ? `${api}:${id}` : `${api}/:${id}`;
  const requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    body: JSON.stringify(body),
    redirect: 'follow'
  };
  return fetch(baseUrl + paramsApi, requestOptions)
    .then(response => response.json())
    .catch(error => console.warn(`[debug] ${paramsApi} delete error: ${error}`));
}



