'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * 创建schema，这个schema对应的数据将用来记录用户
 * 访问一个静态html文件的url的行为
 * @type {Schema}
 */
const StorySchema = new Schema({
  time: {
    type: Date,
    default: Date.now
  },
  url: {
    type: String,
    trim: true,
    index: true
  }
});

/**
 * 创建模型
 */
const model = mongoose.model('Story', StorySchema);

module.exports = model;