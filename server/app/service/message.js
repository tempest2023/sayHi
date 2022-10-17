// app/service/message.js

'use strict';

const Service = require('egg').Service;

class MessageService extends Service {
  async queryAll(data) {
    const { start = 0, end = 10, sort = [ 'id', 'ASC' ], filter = {} } = data;
    const message = await this.ctx.service.base.select('message', {
      orders: [ ...sort ], // sort order
      limit: end - start, // limit the return rows
      offset: start, // data offset
      where: { ...filter },
    });
    const count = await this.ctx.service.base.count('message', filter);
    if (!message) {
      console.log('[service.message.queryAll][error]', message);
      return {
        success: false,
        errno: 1001,
        errmsg: 'fail to get result for this info',
      };
    }
    // update retrieve_time for all messages
    const retrieve_time = String(new Date().getTime());
    const updateReqList = [];
    message.forEach(msg => {
      updateReqList.push(this.ctx.service.base.update('message', {
        retrieve_time,
      }, { id: msg.id }));
    });
    const updateRes = await Promise.all(updateReqList);
    if (updateRes.some(res => !res.success)) {
      console.log('[service.message.queryAll] [error] fail to update retrieve_time when query messages', updateRes);
    }
    message.forEach(msg => {
      msg.retrieve_time = retrieve_time;
    });

    console.log(`[service.message.queryAll] DB: result: ${JSON.stringify(message)}`);
    return {
      data: message,
      success: true,
      count,
    };
  }

  async query(data) {
    const message = await this.ctx.service.base.select('message', { where: { ...data } });
    console.log(`[service.message.query] DB: ${JSON.stringify(data)}, result: ${JSON.stringify(message)}`);
    if (!message || message.length === 0) {
      return {
        success: false,
        errno: 1001,
        errmsg: 'fail to get result for this info',
      };
    }

    // update retrieve_time for all messages
    const retrieve_time = String(new Date().getTime());
    const updateReqList = [];
    message.forEach(msg => {
      updateReqList.push(this.ctx.service.base.update('message', {
        retrieve_time,
      }, { id: msg.id }));
    });
    const updateRes = await Promise.all(updateReqList);
    if (updateRes.some(res => !res.success)) {
      console.log('[service.message.query] [error] fail to update retrieve_time when query messages', updateRes);
    }
    message.forEach(msg => {
      msg.retrieve_time = retrieve_time;
    });

    return {
      data: message[0],
      success: true,
    };
  }

  /**
   * insert a new record to message
   * @param {object} data
   */
  async insert(data) {
    const nowTime = new Date().getTime();
    // create a new message
    // for idempotent problem, the message id must be passed from outside to identify the message
    const { id, userid, receiver_userid, message } = data;
    const messageDup = await this.query({ id });
    if (messageDup && messageDup.success && messageDup.data) {
      // duplicate inserting
      return {
        success: false,
        errno: 2003,
        errmsg: 'duplicate inserting',
      };
    }
    const res = await this.ctx.service.base.insert('message', { id, userid, receiver_userid, message, create_time: nowTime, retrieve_time: '', edit_time: nowTime });
    console.log(`[service.message.insert] DB: ${JSON.stringify({ id, userid, receiver_userid, message })}, result: ${JSON.stringify(res)}`);
    if (!res) {
      return {
        success: false,
        errno: 1002,
        errmsg: 'fail to insert',
      };
    }
    return { success: true, data: res };
  }
  /**
   * Update message info by id
   * @param {object} data
   */
  async update(data) {
    // update message info
    const nowTime = new Date().getTime();
    const { id } = data;
    const messageRes = await this.query({ id });
    if (!messageRes || !messageRes.success) {
      return {
        success: false,
        errno: 1005,
        errmsg: 'fail to find the item when updating',
      };
    }

    const message = messageRes.data;

    const { message: text, retrieve_time } = data;

    const res = await this.ctx.service.base.update('message', {
      message: text || message.message,
      retrieve_time: retrieve_time || message.retrieve_time,
      edit_time: nowTime,
    }, { id });

    console.log(`[service.message.update] DB: ${JSON.stringify({ id, text, retrieve_time })} result: ${JSON.stringify(res)}`);

    if (!res) {
      return {
        success: false,
        errno: 1003,
        errmsg: 'fail to update',
      };
    }
    return { success: true, data: { ...message, ...data } };
  }
  async delete(data) {
    const { id, userid, receiver_userid } = data;
    if (!userid && !receiver_userid) {
      return {
        success: false,
        errno: 1005,
        errmsg: 'fail to find the item when deleting',
      };
    }
    const message = await this.query({ id });
    if (!message || !message.success) {
      return {
        success: false,
        errno: 1005,
        errmsg: 'fail to find the item when deleting',
      };
    }
    let res;
    if (userid) {
      res = await this.ctx.service.base.delete('message', { id, userid });
    } else if (receiver_userid) {
      res = await this.ctx.service.base.delete('message', { id, receiver_userid });
    }
    console.log(`[service.message.delete] DB: ${JSON.stringify({ id })}, result: ${JSON.stringify(res)}`);
    if (!res) {
      return {
        success: false,
        errno: 1004,
        errmsg: 'fail to delete',
      };
    }
    return { success: true, data: message.data };
  }
}

module.exports = MessageService;
