// app/service/base.js

'use strict';

const Service = require('egg').Service;

const table_prefix = 'sayhi_';

// this version is for egg-mysql
class BaseService extends Service {
  isValidJson(s) {
    if (Object.prototype.toString.call(s) === '[object String]') {
      try {
        JSON.parse(s);
      } catch (e) {
        return false;
      }
      return true;
    }
    return Object.prototype.toString.call(s) === '[object Object]' || Object.prototype.toString.call(s) === '[object Array]';
  }

  length(obj) {
    if (Object.prototype.toString.call(obj) === '[object Array]' || Object.prototype.toString.call(obj) === '[object Object]') {
      return Object.keys(obj).length;
    }
    return 0;
  }

  async count(name, filter) {
    try {
      const count = await this.app.mysql.count(table_prefix + name, filter);
      return count;
    } catch (e) {
      console.log(`[service.base.count] DB: fail to count ${name}, ${e}`);
      throw new Error(`[service.base.count] DB: fail to count ${name}, ${e}`);
    }
  }

  async select(name, filter) {
    try {
      const res = await this.app.mysql.select(table_prefix + name, filter);
      return res;
    } catch (e) {
      console.log(`[service.base.select] DB: fail to select ${name}, ${e}`);
      throw new Error(`[service.base.select] DB: fail to select ${name}, ${e}`);
    }
  }

  async get(name, filter) {
    if (this.length(filter) === 0) {
      console.log(`[service.base.getById] fail to get without a specific filter ${filter}`);
      return null;
    }
    try {
      const res = await this.app.mysql.get(table_prefix + name, filter);
      return res;
    } catch (e) {
      console.log(`[service.base.get] DB: fail to get ${name}, ${e}`);
      throw new Error(`[service.base.get] DB: fail to get ${name}, ${e}`);
    }
  }

  async insert(name, values) {
    try {
      const res = await this.app.mysql.insert(table_prefix + name, values);
      return res;
    } catch (e) {
      console.log(`[service.base.insert] DB: fail to insert ${name}, ${e}`);
      throw new Error(`[service.base.insert] DB: fail to insert ${name}, ${e}`);
    }
  }

  async update(name, values, filter) {
    try {
      const res = await this.app.mysql.update(table_prefix + name, values, {
        filter
      });
      return res;
    } catch (e) {
      console.log(`[service.base.update] DB: fail to update ${name}, ${e}`);
      throw new Error(`[service.base.update] DB: fail to update ${name}, ${e}`);
    }
  }

  async delete(name, filter) {
    try {
      const res = await this.app.mysql.delete(table_prefix + name, filter);
      return res;
    } catch (e) {
      console.log(`[service.base.delete] DB: fail to delete ${name}, ${e}`);
      throw new Error(`[service.base.delete] DB: fail to delete ${name}, ${e}`);
    }
  }
}
module.exports = BaseService;
