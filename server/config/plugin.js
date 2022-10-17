'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  postgres: {
    enable: true,
    package: 'egg-postgres',
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  validate: {
    enable: true,
    package: 'egg-validate',
  },
  redis: {
    enable: true,
    package: 'egg-redis',
  },
};
