'use strict';
const BaseController = require('./base');
const uuid = require('uuid');

const { v4: uuidv4 } = uuid;

const tokenExpireTime = 1000 * 60 * 60 * 24 * 7; // one week

class UserController extends BaseController {
  async login() {
    const { ctx } = this;

    // validate rules for params
    const createRule = {
      username: { type: 'string', required: false },
      email: { type: 'string', required: false },
      password: { type: 'string' }
      // now we only use username to login,
      // [TODO] add password and third-part login
    };
    ctx.validate(createRule, ctx.request.body);

    const data = await ctx.service.user.login(ctx.request.body);
    console.log(`[controller.users.signin] ${JSON.stringify(data)}`);

    if (data.success) {
      const { userid } = data.data;
      const redis = ctx.app.redis;
      const token = await redis.get(`token${userid}`);

      if (token) {
        // renew token life
        data.data.token = token;
        await redis.set(`expire${userid}`, String(new Date().getTime() + tokenExpireTime));
      } else {
        // generate new token
        data.data.token = uuidv4();
        await redis.set(`token${userid}`, data.data.token);
        await redis.set(`expire${userid}`, String(new Date().getTime() + tokenExpireTime));
      }
    }

    return (ctx.body = { errno: 0, ...data });
  }

  async checkAuth() {
    const { ctx } = this;
    const { userid, token } = ctx.request.body;
    return (ctx.body = { errno: 0, success: true, data: { token, userid } });
  }

  async index() {
    const { ctx } = this;
    const { start = 0, end = 10, sort = ['id', 'ASC'], filter = {} } = ctx.request.body;
    const res = await ctx.service.user.queryAll({ start, end, sort, filter });
    console.log(`[controller.users.index] ${JSON.stringify(res)}`);
    ctx.set('x-total-count', res.count);
    if (!res.success) {
      throw new Error('fail to query users');
    }
    return (ctx.body = {
      errno: 0,
      ...res
    });
  }

  async new() {
    return (this.ctx.body = {
      errno: 0
    });
  }

  async create() {
    const { ctx } = this;
    const createRule = {
      email: { type: 'string' },
      password: { type: 'string' },
      realname: { type: 'string' }
    };
    ctx.validate(createRule, ctx.request.body);
    const data = await ctx.service.user.insert({ ...ctx.request.body });
    console.log(`[controller.users.create] ${JSON.stringify(data)}`);
    return (ctx.body = { errno: 0, ...data });
  }

  async show() {
    const { ctx } = this;
    const userid = this.getUserId();

    const createRule = {
      userid: { type: 'string' }
    };
    ctx.validate(createRule, { userid });

    const data = await ctx.service.user.query({ userid });
    console.log(`[controller.users.show] ${JSON.stringify(data)}`);
    return (ctx.body = { errno: 0, ...data });
  }

  async edit() {
    return (this.ctx.body = {
      errno: 0
    });
  }

  async update() {
    const { ctx } = this;
    const createRule = {
      username: { type: 'string' },
      realname: { type: 'string' },
      email: { type: 'string' },
      gender: { type: 'string' },
      age: { type: 'int' },
      userid: { type: 'string' }
    };
    const userid = ctx.request.header['x-userid'];
    const query = {
      userid,
      username: ctx.request.body.username,
      realname: ctx.request.body.realname,
      email: ctx.request.body.email,
      gender: ctx.request.body.gender,
      age: ctx.request.body.age
    };
    console.log('[controller.users.update] ', JSON.stringify(query));
    ctx.validate(createRule, query);

    const data = await ctx.service.user.update(query);
    console.log(`[controller.users.update] ${JSON.stringify(data)}`);
    return (ctx.body = { errno: 0, ...data });
  }

  async destroy() {
    const { ctx } = this;
    const userid = this.getUserId();
    const createRule = {
      userid: { type: 'string' }
    };
    ctx.validate(createRule, { userid });
    const data = await ctx.service.user.delete({ userid });
    if (data.success) {
      const { userid } = data.data;
      const redis = ctx.app.redis;
      // clear token in redis
      await redis.set(`token${userid}`, null);
      await redis.set(`expire${userid}`, null);
    }
    console.log(`[controller.users.destroy] ${JSON.stringify(data)}`);
    return (ctx.body = { errno: 0, ...data });
  }

  async randomPickUsers() {
    const { ctx } = this;
    const count = await this.service.base.count('user');
    // get random number [0, count)]
    const random = Math.floor(Math.random() * count);
    // console.log('[controller.users.randomPickUsers] random number: ', random, count);
    const data = await ctx.service.user.queryAll({ start: random, end: random + 1 });
    return (ctx.body = { errno: 0, success: true, ...data });
  }
}

module.exports = UserController;
