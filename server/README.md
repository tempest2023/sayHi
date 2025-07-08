# sayHiBackend

the backend of say hi

### Development

#### 1. Launch your MySQL Server
> You can launch the server on localhost or remote

A. Launch your mysql server on localhost

`brew services start mysql`

B. Set the mysql setting in `/server/config/config.default.js` to remote mysql server

> Other DB like PostgreSQL

Set the PostgreSQL setting in `/server/config/config.default.js`

#### 2. Launch your Redis Server

A. launch your redis server on localhost

`brew services start redis`

B. set the redis setting in `/server/config/config.default.js` to remote redis server 

#### 3. Import sql data structure to you DB.

See `/sayhi.mysql.sql` or `/sayhi.postgre.sql`

Import sql data to MySQL:
```shell
# database name 'SayHi' is configed in config.default.js
mysql -u username -p SayHi < sayhi.sql
```

#### 4. Install dependencies and Run the server

```bash
$ yarn install
$ yarn dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ yarn start
```

### Deploy Tool

```bash
yarn global add pm2
```

-  Use `pm2 start` to deploy node server, see [pm2](https://pm2.keymetrics.io/) for more detail.

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


## Egg.js

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

[egg]: https://eggjs.org