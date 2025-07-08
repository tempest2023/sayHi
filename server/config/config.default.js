/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {
    mode: 'file',
    // postgres: {
    //   client: {
    //     // host
    //     host: '127.0.0.1',
    //     // port
    //     port: '5432',
    //     // username
    //     user: 'rentao',
    //     // password
    //     password: '',
    //     // database
    //     database: 'SayHi'
    //   },
    //   app: true,
    //   agent: false
    // },
    mysql: {
      client: {
        // host
        host: '127.0.0.1',
        // port
        port: 3306,
        // username
        user: 'root',
        // password, default is root, change to your own password
        password: 'root',
        // database
        database: 'SayHi',
      },
      // load into app, default is open
      app: true,
      // load into agent, default is close
      agent: false,
    },
    redis: {
      client: {
        port: 6379, // Redis port
        host: '127.0.0.1', // Redis host
        password: '',
        db: 0
      }
    }
  };

  config.errorHandler = {
    match: '/'
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1665788833510_9752';

  config.security = {
    domainWhiteList: ['*'],
    csrf: {
      enable: false
    }
  };
  config.cors = {
    origin: '*',
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };

  config.bodyParser = {
    enable: true,
    formLimit: '300mb',
    jsonLimit: '300mb',
    textLimit: '300mb',
    strict: true,
    // @see https://github.com/hapijs/qs/blob/master/lib/parse.js#L8 for more options
    queryString: {
      arrayLimit: 10000,
      depth: 50,
      parameterLimit: 10000
    }
  };

  config.session = {
    key: 'SayHi',
    maxAge: 30 * 24 * 3600 * 1000, // 30 days
    httpOnly: true,
    encrypt: true,
    renew: true
  };

  config.validate = true;

  // add your middleware config here
  config.middleware = ['sessionToken', 'errorHandler'];
  config.appName = 'SayHi Backend';

  return {
    ...config
  };
};
