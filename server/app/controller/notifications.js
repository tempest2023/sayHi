'use strict';
const BaseController = require('./base');
const ROLE = require('../role');

class NotificationController extends BaseController {
  /**
   * select all messages received by this user
   * @return message list
   */
  async index() {
    const { ctx } = this;
    const { start = 0, end = 10, sort = [ 'create_time', 'DESC' ], filter = {} } = ctx.request.body;
    // only can query the messages belong to this user as receiver.
    filter.receiver_userid = ctx.request.header['x-userid'];
    const res = await ctx.service.message.queryAll({ start, end, sort, filter }, ROLE.RECEIVER);
    console.log(`[controller.notifications.index] ${JSON.stringify(res)}`);
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
   * select the latest message received by this user
   */
  async new() {
    const { ctx } = this;
    const { start = 0, end = 1, sort = [ 'create_time', 'DESC' ], filter = {} } = ctx.request.body;
    // only can query the messages belong to this user.
    filter.receiver_userid = ctx.request.header['x-userid'];
    const res = await ctx.service.message.queryAll({ start, end, sort, filter }, ROLE.RECEIVER);
    console.log(`[controller.notifications.new] ${JSON.stringify(res)}`);
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
   * select messages by specific sender (this user as receiver)
   * @return message list
   */
  async show() {
    const { ctx } = this;
    const userid = this.getUserId();
    const { start = 0, end = 10, sort = [ 'create_time', 'DESC' ], filter = {} } = ctx.request.body;
    const createRule = {
      userid: { type: 'string' },
    };
    ctx.validate(createRule, { userid });
    const receiver_userid = ctx.request.header['x-userid'];
    filter.receiver_userid = receiver_userid;
    filter.userid = userid;
    const data = await ctx.service.message.queryAll({ start, end, sort, filter }, ROLE.RECEIVER);
    console.log(`[controller.notifications.show] ${JSON.stringify(data)}`);
    return (ctx.body = { errno: 0, ...data });

  }

  /**
   * @return true
   */
  async create() {
    return (this.ctx.body = { errno: 0 });
  }

  async edit() {
    return (this.ctx.body = {
      errno: 0,
    });
  }
  /**
   * update a message's retrieve_time as a receiver
   * @return true
   */
  async update() {
    const { ctx } = this;
    const createRule = {
      retrieve_time: { type: 'string' },
    };
    const id = this.getUserId();
    console.log('[controller.notifications.update] ', JSON.stringify(ctx.request.body));
    ctx.validate(createRule, ctx.request.body);
    const receiver_userid = ctx.request.header['x-userid'];
    const query = {
      receiver_userid,
      id,
    };
    // check if the message belongs to this user
    const msg = await ctx.service.message.query(query);
    if (!msg || !msg.success) {
      return (ctx.body = { ...msg });
    }
    // add retrive time
    query.retrieve_time = ctx.request.body.retrieve_time;
    const data = await ctx.service.message.update(query);
    console.log(`[controller.notifications.update] ${JSON.stringify(data)}`);
    return (ctx.body = { errno: 0, ...data });
  }

  /**
   * delete a message as receiver
   * @return true
   */
  async destroy() {
    const { ctx } = this;
    const id = this.getUserId();
    const createRule = {
      id: { type: 'string' },
    };
    ctx.validate(createRule, { id });
    const receiver_userid = ctx.request.header['x-userid'];
    // check if the message belongs to this user
    const msg = await ctx.service.message.query({ id, receiver_userid });
    if (!msg || !msg.success) {
      return (ctx.body = { ...msg });
    }
    const data = await ctx.service.message.delete({ id, receiver_userid });
    console.log(`[controller.notifications.destroy] ${JSON.stringify(data)}`);
    return (ctx.body = { errno: 0, ...data });
  }
}

module.exports = NotificationController;
