'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  mysql: {
    enable: true,
    package: 'egg-mysql'
  },
  cors: {
    enable: true,
    package: 'egg-cors'
  },
  validate: {
    enable: true,
    package: 'egg-validate'
  },
  redis: {
    enable: true,
    package: 'egg-redis'
  }
};
