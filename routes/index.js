'use strict';

const Router = require('koa-router');
const router = new Router();

const clickEventController = require('../controllers/clickEvent');
const storyController = require('../controllers/story');

router
  .get('/api/events', clickEventController.list)
  .post('/api/event', clickEventController.post)
  .get('/api/stories', storyController.list);

module.exports = router;