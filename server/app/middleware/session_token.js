'use strict';
const authorizedResources = (url, method, resources) => {
  for (const key in resources) {
    if (url.startsWith(key)) {
      if (resources[key].filter(each => each === method).length > 0) {
        return true;
      }
    }
  }
  return false;
};
module.exports = () => {
  return async function sessionToken(ctx, next) {
    try {
      const userid = ctx.request.header['x-userid'];
      const token = ctx.request.header['x-token'];
      const tokenTime = ctx.request.header['x-token-timestamp'];
      const clientApiList = [ '/checkUserAuth', '/sendMessage', '/queryHistoryMessage', '/randomPickUsers' ];
      const resources = { '/api/v1/users': [ 'PUT', 'GET', 'PATCH', 'DELETE' ], '/api/v1/messages': [ 'POST', 'PUT', 'GET', 'PATCH', 'DELETE' ] };
      const interfaceList = clientApiList;
      const { url } = ctx.request;
      console.log('[auth] need auth: ', ctx.request.method, url, interfaceList.includes(url), authorizedResources(url, ctx.request.method, resources));
      // need to check token
      if (interfaceList.includes(url) || authorizedResources(url, ctx.request.method, resources)) {
        const redis = ctx.app.redis;
        // usu redis to implement session
        const redis_token = await redis.get(`token${userid}`);
        const redis_token_expire_string = await redis.get(`expire${userid}`) || '';
        const redis_token_expire = parseInt(redis_token_expire_string);
        if (redis_token !== token || redis_token_expire < parseInt(tokenTime)) {
          console.log(`[auth] validate fail ${redis_token} ${JSON.stringify({ userid, token })} expire_time: ${redis_token_expire}, tokenTime: ${tokenTime}`);
          return (ctx.body = {
            errmsg: 'fail to validate token',
            errno: 2000,
            success: false,
          });
        }
      }
      await next();
    } catch (err) {
      ctx.app.emit('error', err, ctx);
    }
  };
};

