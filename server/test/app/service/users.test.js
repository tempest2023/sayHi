'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/service/test.test.js', () => {
  it('should get users', async () => {
    const ctx = app.mockContext();
    const user = await ctx.service.user.queryAll({ start: 0, end: 10, sort: [ 'id', 'ASC' ], filter: {
      status: 'ACTIVE',
    } });
    assert(user);
    assert(user.success === true);
  });
});
