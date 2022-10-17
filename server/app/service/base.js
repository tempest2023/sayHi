// app/service/base.js

'use strict';

const Service = require('egg').Service;

const table_prefix = 'sayhi_';

class BaseService extends Service {
  async count(name, filter) {
    try {
      let query = `select count(*) from ${table_prefix}${name} where `;
      for (const key in filter) {
        query += `${key} = '${filter[key]}' and `;
      }
      query += '1=1';
      const count = await this.app.postgres.query(query);
      return parseInt(count.rows[0].count);
    } catch (e) {
      console.log(`[service.base.count] DB: fail to count ${name}, ${e}`);
      throw new Error(`[service.base.count] DB: fail to count ${name}, ${e}`);
    }
  }
  async select(name, filter) {
    try {
      let query = `select * from ${table_prefix}${name} `;
      if (filter.where) {
        query += 'where ';
        for (const key in filter.where) {
          query += `${key} = '${filter.where[key]}' and `;
        }
        query += '1=1 ';
      }
      if (filter.orders) {
        const orderColumn = filter.orders[0];
        const orderType = filter.orders[1];
        query += `order by ${orderColumn} ${orderType} `;
      }
      if (filter.limit) {
        query += `limit ${filter.limit} `;
      }
      if (filter.offset) {
        query += `offset ${filter.offset} `;
      }
      console.log('[service.base.select]', query);
      const res = await this.app.postgres.query(query);
      return res.rows;
    } catch (e) {
      console.log(`[service.base.select] DB: fail to select ${name}, ${e}`);
      throw new Error(`[service.base.select] DB: fail to select ${name}, ${e}`);
    }
  }
  async insert(name, values) {
    try {
      let query = `insert into ${table_prefix}${name} `;
      const keys = [];
      const valuesArray = [];
      for (const key in values) {
        if (typeof values[key] === 'string') {
          values[key] = '\'' + values[key] + '\'';
        }
        keys.push(key);
        valuesArray.push(values[key]);
      }
      query += `(${keys.join(',')}) values (${valuesArray.join(',')})`;
      console.log('[service.base.insert]', query);
      const res = await this.app.postgres.query(query);
      return res.rows;
    } catch (e) {
      console.log(`[service.base.insert] DB: fail to create ${name}, ${e}`);
      throw new Error(`[service.base.insert] DB: fail to create ${name}, ${e}`);
    }
  }
  async update(name, values, filter) {
    try {
      let query = `update ${table_prefix}${name} set `;
      const keys = [];
      const valuesArray = [];
      for (const key in values) {
        keys.push(key);
        valuesArray.push(values[key]);
      }
      for (let i = 0; i < keys.length; i++) {
        query += `${keys[i]} = '${valuesArray[i]}'`;
        if (i !== keys.length - 1) {
          query += ',';
        }
      }
      query += ' where ';
      for (const key in filter) {
        query += `${key} = '${filter[key]}' and `;
      }
      query += '1=1 ';
      console.log('[service.base.update]', query);
      const res = await this.app.postgres.query(query);
      return res.rows;
    } catch (e) {
      console.log(`[service.base.update] DB: fail to update ${name}, ${e}`);
      throw new Error(`[service.base.update] DB: fail to update ${name}, ${e}`);
    }
  }
  async delete(name, filter) {
    try {
      let query = `delete from ${table_prefix}${name} where `;
      for (const key in filter) {
        query += `${key} = '${filter[key]}' and `;
      }
      query += '1=1';
      console.log('[service.base.delete]', query);
      const res = await this.app.postgres.query(query);
      return res.rows;
    } catch (e) {
      console.log(`[service.base.delete] DB: fail to delete ${name}, ${e}`);
      throw new Error(`[service.base.delete] DB: fail to delete ${name}, ${e}`);
    }
  }
}
module.exports = BaseService;
