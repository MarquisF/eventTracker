'use strict';

const ClickEventModel = require('../models/ClickEvent');
require('../models/Story');

exports.list = async function(ctx, next) {
  let pageSize = 10;
  let page = 1;

  const requestQuery = ctx.query;
  if (typeof requestQuery.pageSize === 'string') {
    pageSize = parseInt(requestQuery.pageSize);
  }

  if (typeof requestQuery.page === 'string') {
    page = parseInt(requestQuery.page);
  }

  const skip = ( page - 1 ) * pageSize;
  const limit = pageSize;

  const query = ClickEventModel
    .find()
    .populate(
      'story',
      ['_id', 'time', 'url']
    )
    .skip(skip)
    .limit(limit);
  const list = await query.exec();

  ctx.body = list;
}

exports.post = async function(ctx, next) {
  const { elementId, elementClassName, x, y } = ctx.request.body;
  let { url } = ctx.request.body;
  const storyId = ctx.cookies.get('story_id');

  url = `/${url.split('/').slice(4).join('/')}`;

  const clickEvent = new ClickEventModel({
    element_id: elementId,
    element_classname: elementClassName,
    story: storyId,
    url, x, y
  })

  const res = await clickEvent.save();
  // console.log(res)

  // // promise.then( doc => {
  // //   ctx.body = 'hahaha'
  // // })
  ctx.body = res;
}