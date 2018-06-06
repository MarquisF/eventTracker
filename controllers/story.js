'use strict';

const StoryModel = require('../models/Story');

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

  const query = StoryModel
    .find()
    .skip(skip)
    .limit(limit);
  const list = await query.exec();

  ctx.body = list;
}