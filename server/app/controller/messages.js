'use strict';
const BaseController = require('./base');

class MessageController extends BaseController {
  /**
   * select all messages sent by this user
   * @returns message list
   */
  async index() {
    const { ctx } = this;
    const { start = 0, end = 10, sort = [ 'create_time', 'ASC' ], filter = {} } = ctx.request.body;
    // only can query the messages belong to this user.
    filter.userid = ctx.request.header['x-userid'];
    const res = await ctx.service.message.queryAll({ start, end, sort, filter });
    console.log(`[controller.messages.index] ${JSON.stringify(res)}`);
    ctx.set('x-total-count', res.count);
    if (!res.success) {
      throw new Error('fail to query users');
    }
    return (ctx.body = {
      errno: 0,
      ...res,
    });
  }

  /**
   * select the latest message sent by this user
   */
  async new() {
    const { ctx } = this;
    const { start = 0, end = 1, sort = [ 'create_time', 'DESC' ], filter = {} } = ctx.request.body;
    // only can query the messages belong to this user.
    filter.userid = ctx.request.header['x-userid'];
    const res = await ctx.service.message.queryAll({ start, end, sort, filter });
    console.log(`[controller.messages.new] ${JSON.stringify(res)}`);
    ctx.set('x-total-count', res.count);
    if (!res.success) {
      throw new Error('fail to query users');
    }
    return (ctx.body = {
      errno: 0,
      ...res,
    });
  }

  /**
   * select messages by specific receiver_userid (from this user)
   * @return message list
   */
  async show() {
    const { ctx } = this;
    const receiver_userid = this.getUserId();
    const { start = 0, end = 10, sort = [ 'create_time', 'ASC' ], filter = {} } = ctx.request.body;
    const createRule = {
      receiver_userid: { type: 'string' },
    };
    ctx.validate(createRule, { receiver_userid });
    filter.userid = ctx.request.header['x-userid'];
    filter.receiver_userid = receiver_userid;
    const data = await ctx.service.message.queryAll({ start, end, sort, filter });
    console.log(`[controller.messages.show] ${JSON.stringify(data)}`);
    return (ctx.body = { errno: 0, ...data });

  }

  /**
   * send mssage to a receiver
   * @returns true
   */
  async create() {
    const { ctx } = this;
    const createRule = {
      message: { type: 'string' },
      receiver_userid: { type: 'string' },
    };
    ctx.validate(createRule, ctx.request.body);
    const userid = ctx.request.header['x-userid'];
    if (userid === ctx.request.body.receiver_userid) {
      return (ctx.body = {
        errno: 2004,
        errmsg: 'cannot send message to yourself',
      });
    }
    const id = await this.ctx.service.base.count('message') + 1;
    const query = { id, userid, receiver_userid: ctx.request.body.receiver_userid, message: ctx.request.body.message };
    const data = await ctx.service.message.insert(query);
    console.log(`[controller.messages.create] ${JSON.stringify(data)}`);
    return (ctx.body = { errno: 0, ...data });
  }

  async edit() {
    return (this.ctx.body = {
      errno: 0,
    });
  }

  /**
   * edit a message as sender
   * @returns true
   */
  async update() {
    const { ctx } = this;
    const createRule = {
      id: { type: 'int' },
      message: { type: 'string' },
    };
    console.log('[controller.messages.update] ', JSON.stringify(ctx.request.body));
    ctx.validate(createRule, ctx.request.body);
    const userid = ctx.request.header['x-userid'];
    const query = {
      userid,
      id: ctx.request.body.id,
      message: ctx.request.body.message,
    };
    const data = await ctx.service.message.update(query);
    console.log(`[controller.messages.update] ${JSON.stringify(data)}`);
    return (ctx.body = { errno: 0, ...data });
  }

  /**
   * delete a message as sender
   * @returns true
   */
  async destroy() {
    const { ctx } = this;
    const id = this.getUserId();
    const createRule = {
      id: { type: 'string' },
    };
    ctx.validate(createRule, { id });
    const userid = ctx.request.header['x-userid'];
    // check if the message belongs to this user
    const msg = await ctx.service.message.query({ id, userid });
    if (!msg || !msg.success) {
      return (ctx.body = { ...msg });
    }
    const data = await ctx.service.message.delete({ id, userid });
    console.log(`[controller.messages.destroy] ${JSON.stringify(data)}`);
    return (ctx.body = { errno: 0, ...data });
  }
}

module.exports = MessageController;
