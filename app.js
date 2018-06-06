'use strict';

const http = require('http');
const https = require('https');
const Koa = require('koa');
const Router = require('koa-router');
const mount = require('koa-mount');
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');

/**
 * 本地文件
 */
const appRoutes = require('./routes/index');
const utils = require('./utils/index');
const getCtxFileExtension = utils.getCtxFileExtension;

/**
 * 构建实例
 */
const app = new Koa();
const router = new Router();

/**
 * 连接 mongodb
 */
mongoose.connect('mongodb://localhost/eventTracker');
const db = mongoose.connection;
//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log( 'Connected to MongoDB.');
  // we're connected!
});

const RECEPTOR_STATIC_ROOT = `${__dirname}/static/receptor`;
const RECEPTOR_STATIC_ROUTE_NAME = 'receptor';

const STAT_STATIC_ROOT = `${__dirname}/static/stat`;
const STAT_STATIC_ROUTE_NAME = 'stat';

/**
 * koa-bodyparser中间件可以把koa2上下文的formData数据解析到ctx.request.body中
 */
app.use(bodyParser());

/**
 * 在静态 html 文件后插入用来在前端埋点的静态 javascript 代码
 */
app.use( async(ctx, next) => {
  await next();

  const url = ctx.request.url;
  const firstRoutePart = url.split('/')[1];

  if (
    firstRoutePart === RECEPTOR_STATIC_ROUTE_NAME
    && ctx.body
    && getCtxFileExtension(ctx) === 'html'
  ) {
    const getRawBody = require('raw-body');

    /**
     * 用户访问静态 html 页面后创建新的 story
     * 并将这个 story 的 id 存入 cookie
     */
    const StoryModel = require('./models/Story');
    const newStory = new StoryModel({ url });
    const newStory_db = await newStory.save();
    ctx.cookies.set( 'story_id', newStory_db._id );

    /**
     * 在返回的静态 html 文件之后添加 script 标签
     * 以插入埋点代码
     */
    const ctxBody_buffer = await getRawBody(ctx.body);
    let ctxBody_string = ctxBody_buffer.toString('utf-8');
    ctxBody_string = `${ctxBody_string}
      <script src='/static/scripts/common/axios@0.18.0.min.js'></script>
      <script
        type=module
        src='/static/scripts/tracker/eventTracker.js'
      ></script>
    `;

    ctx.body = ctxBody_string;
  }

})

/**
 * 构建静态文件路由 /public
 */

app.use(
  mount(`/${RECEPTOR_STATIC_ROUTE_NAME}`,
  require('koa-static')(RECEPTOR_STATIC_ROOT, {
    gzip: true
  }))
);

app.use(
  mount(`/${STAT_STATIC_ROUTE_NAME}`,
  require('koa-static')(STAT_STATIC_ROOT, {
    gzip: true
  }))
);

app.use(
  mount(`/static`,
  require('koa-static')('static', {
    gzip: true
  }))
);

app
  .use(appRoutes.routes())
  .use(appRoutes.allowedMethods());

http.createServer(app.callback()).listen(3000);
console.log('The event tracker is listening on port 3000');