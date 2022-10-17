'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {
  getUserId() {
    const paramsList = this.ctx.request.url.split(':');
    if (!paramsList || paramsList.length < 2) {
      return '';
    }
    return paramsList[1];
  }
}

module.exports = BaseController;
