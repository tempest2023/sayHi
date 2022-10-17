'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  // user resources
  router.resources('users', '/api/v1/users', controller.users);
  router.post('/login', controller.users.login);
  router.post('/checkUserAuth', controller.users.checkAuth);

  router.get('/randomPickUsers', controller.users.randomPickUsers);

  // message
  router.resources('messages', '/api/v1/messages', controller.messages);
  router.resources('notifications', '/api/v1/notifications', controller.notifications);
};
