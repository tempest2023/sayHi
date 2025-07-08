'use strict';

const Service = require('egg').Service;
const { escapeId } = require('mysql2');

const table_prefix = 'sayhi_';

// this version is for egg-mysql2
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

  async count(name, filter = {}) {
    try {
      const whereKeys = Object.keys(filter);
      const values = Object.values(filter);
      const whereClause = whereKeys.length
        ? 'WHERE ' + whereKeys.map(k => `${escapeId(k)} = ?`).join(' AND ')
        : '';
      const sql = `SELECT COUNT(*) AS count FROM ${escapeId(table_prefix + name)} ${whereClause}`;
      const [rows] = await this.app.mysql.query(sql, values);
      return rows[0]?.count || 0;
    } catch (e) {
      console.log(`[service.base.count] DB: fail to count ${name}, ${e}`);
      throw new Error(`[service.base.count] DB: fail to count ${name}, ${e}`);
    }
  }

  async select(name, options = {}) {
    const {
      where = {},
      columns = '*',
      orders = [],
      limit,
      offset
    } = options;

    try {
      const values = [];
      const whereKeys = Object.keys(where);
      const whereClause = whereKeys.length
        ? 'WHERE ' + whereKeys.map(k => {
          values.push(where[k]);
          return `${escapeId(k)} = ?`;
        }).join(' AND ')
        : '';

      const orderClause = orders.length
        ? 'ORDER BY ' + orders.map(([key, dir]) => `${escapeId(key)} ${dir}`).join(', ')
        : '';

      const limitClause = typeof limit === 'number' ? `LIMIT ${limit}` : '';
      const offsetClause = typeof offset === 'number' ? `OFFSET ${offset}` : '';

      const cols = Array.isArray(columns) ? columns.map(c => escapeId(c)).join(', ') : columns;

      const sql = `SELECT ${cols} FROM ${escapeId(table_prefix + name)} ${whereClause} ${orderClause} ${limitClause} ${offsetClause}`;
      const [rows] = await this.app.mysql.query(sql, values);
      return rows;
    } catch (e) {
      console.log(`[service.base.select] DB: fail to select ${name}, ${e}`);
      throw new Error(`[service.base.select] DB: fail to select ${name}, ${e}`);
    }
  }

  async get(name, where = {}) {
    if (this.length(where) === 0) {
      console.log('[service.base.get] fail to get without a specific filter');
      return null;
    }
    const rows = await this.select(name, { where, limit: 1 });
    return rows[0] || null;
  }

  async insert(name, data = {}) {
    try {
      const keys = Object.keys(data);
      const values = Object.values(data);
      const placeholders = keys.map(() => '?').join(', ');
      const sql = `INSERT INTO ${escapeId(table_prefix + name)} (${keys.map(k => escapeId(k)).join(', ')}) VALUES (${placeholders})`;
      const [res] = await this.app.mysql.query(sql, values);
      return res;
    } catch (e) {
      console.log(`[service.base.insert] DB: fail to insert ${name}, ${e}`);
      throw new Error(`[service.base.insert] DB: fail to insert ${name}, ${e}`);
    }
  }

  async update(name, data = {}, where = {}) {
    try {
      const sets = [];
      const values = [];

      for (const key in data) {
        sets.push(`${escapeId(key)} = ?`);
        values.push(data[key]);
      }

      const whereKeys = Object.keys(where);
      const whereClause = whereKeys.map(k => {
        values.push(where[k]);
        return `${escapeId(k)} = ?`;
      }).join(' AND ');

      const sql = `UPDATE ${escapeId(table_prefix + name)} SET ${sets.join(', ')} WHERE ${whereClause}`;
      const [res] = await this.app.mysql.query(sql, values);
      return res;
    } catch (e) {
      console.log(`[service.base.update] DB: fail to update ${name}, ${e}`);
      throw new Error(`[service.base.update] DB: fail to update ${name}, ${e}`);
    }
  }

  async delete(name, where = {}) {
    try {
      const whereKeys = Object.keys(where);
      const values = Object.values(where);
      const whereClause = whereKeys.map(k => `${escapeId(k)} = ?`).join(' AND ');
      const sql = `DELETE FROM ${escapeId(table_prefix + name)} WHERE ${whereClause}`;
      const [res] = await this.app.mysql.query(sql, values);
      return res;
    } catch (e) {
      console.log(`[service.base.delete] DB: fail to delete ${name}, ${e}`);
      throw new Error(`[service.base.delete] DB: fail to delete ${name}, ${e}`);
    }
  }
}

module.exports = BaseService;
