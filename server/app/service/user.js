// app/service/user.js

'use strict';

const Service = require('egg').Service;

const crypto = require('crypto');

const uuid = require('uuid');
const { v4: uuidv4 } = uuid;

function md5(text) {
  return crypto.createHash('md5').update(text).digest('hex');
}

class UserService extends Service {
  /**
   * check username and password to login
   * @param {object} data { username, password, email }
   * @returns
   */
  async login(data) {
    const { username, password, email } = data;
    if (!username && !email) {
      return {
        success: false,
        errno: 9999,
        errmsg: 'Invalid Parameters'
      };
    }
    let user;
    if (username) {
      user = await this.ctx.service.base.select('user', { where: { username, password } });
    } else if (email) {
      user = await this.ctx.service.base.select('user', { where: { email, password } });
    }

    console.log(`[service.user.login] DB: ${username}, ${email}, ${password}, query result: ${JSON.stringify(user)}`);
    if (!user || user.length === 0) {
      return {
        success: false,
        errno: 2001,
        errmsg: 'fail to login, mismatched username and password'
      };
    }
    user.forEach(item => {
      item.password = null;
    });
    return {
      data: user[0],
      success: true
    };
  }

  /**
   * query all users by filter
   * @param {object} data { start = 0, end = 10, sort = [ 'id', 'ASC' ], filter = {} }
   * @returns
   */
  async queryAll(data) {
    const { start = 0, end = 10, sort = ['id', 'ASC'], filter = {} } = data;
    const user = await this.ctx.service.base.select('user', {
      orders: [sort], // sort order
      limit: end - start, // limit the return rows
      offset: start, // data offset
      where: { ...filter }
    });
    const count = await this.ctx.service.base.count('user');
    if (!user) {
      console.log('[service.user.queryAll][error]', user);
      return {
        success: false,
        errno: 1001,
        errmsg: 'fail to get result for this info'
      };
    }
    // filter password
    user.forEach(item => {
      item.password = null;
    });
    console.log(`[service.user.queryAll] DB: result: ${JSON.stringify(user)}`);
    return {
      data: user,
      success: true,
      count
    };
  }

  /**
   * query a user by specific attribute like id, userid, username, realname, email
   * @param {object} data
   * @returns
   */
  async query(data) {
    const user = await this.ctx.service.base.select('user', { where: { ...data } });
    console.log(`[service.user.query] DB: ${JSON.stringify(data)}, result: ${JSON.stringify(user)}`);
    if (!user || user.length === 0) {
      return {
        success: false,
        errno: 1001,
        errmsg: 'fail to get result for this info'
      };
    }
    user.forEach(item => {
      item.password = null;
    });
    // In this method, password can not be null, because it updates with this default info.
    return {
      data: user[0],
      success: true
    };
  }

  /**
   * insert a new user
   * @param {object} data user info {password, realname, username = 'username', email, status = 'ACTIVE', age = 0, gender = "unknown", avatar = ''}
   */
  async insert(data) {
    const nowTime = new Date().getTime();
    // create a new user
    const { password, realname, username = 'username', email, status = 'ACTIVE', age = 0, gender = 'unknown', avatar = '' } = data;
    let userid = uuidv4();
    let useridDup = await this.query({ userid });
    while (useridDup && useridDup.success) {
      userid = uuidv4();
      useridDup = await this.query({ userid });
    }
    // check email duplicate
    const user = await this.query({ email });
    if (user && user.success) {
      return {
        success: false,
        errno: 2002,
        errmsg: 'fail to register, duplicate email'
      };
    }
    const res = await this.ctx.service.base.insert('user', { username, userid, email, password, realname, age, gender, avatar, create_time: nowTime, edit_time: nowTime, status });
    console.log(`[service.user.insert] DB: ${JSON.stringify({ username, userid, email, password, realname, age, gender, avatar, create_time: nowTime, edit_time: nowTime, status })}, result: ${JSON.stringify(res)}`);
    if (!res) {
      return {
        success: false,
        errno: 1002,
        errmsg: 'fail to insert'
      };
    }
    return { success: true, data: { id: res.insertId } };
  }

  /**
   * Update user information by userid
   * @param {object} data  user info {id, username, password, realname, email}
   */
  async update(data) {
    // update user info
    const nowTime = new Date().getTime();
    const { userid } = data;
    const userRes = await this.query({ userid });
    if (!userRes || !userRes.success) {
      return {
        success: false,
        errno: 1005,
        errmsg: 'fail to find the item when updating'
      };
    }

    const user = userRes.data;

    const { username, email, password, realname, age, gender, avatar, status, edit_time = nowTime } = data;

    const res = await this.ctx.service.base.update('user', {
      username: username || user.username,
      password: password ? md5(password) : user.password,
      realname: realname || user.realname,
      email: email || user.email,
      age: (age === 0) ? age : (age || user.age),
      gender: gender || user.gender,
      avatar: avatar || user.avatar,
      status: status || user.status,
      edit_time: edit_time || user.edit_time
    }, { userid });

    console.log(`[service.user.update] DB: ${JSON.stringify({ userid, username, email, password, realname, age, gender, avatar, status })}, result: ${JSON.stringify(res)}`);

    if (!res) {
      return {
        success: false,
        errno: 1003,
        errmsg: 'fail to update'
      };
    }
    return { success: true, data: { ...user, ...data } };
  }

  /**
   * Delete a user by userid
   * @param {object} data {userid}
   * @returns
   */
  async delete(data) {
    const { userid } = data;
    const user = await this.ctx.service.user.query({ userid });
    if (!user || !user.success) {
      return {
        success: false,
        errno: 1005,
        errmsg: 'fail to find the item when deleting'
      };
    }
    const res = await this.ctx.service.base.delete('user', { userid });
    console.log(`[service.user.delete] DB: ${JSON.stringify({ userid })}, result: ${JSON.stringify(res)}`);
    if (!res) {
      return {
        success: false,
        errno: 1004,
        errmsg: 'fail to delete'
      };
    }
    return { success: true, data: user.data };
  }
}

module.exports = UserService;
