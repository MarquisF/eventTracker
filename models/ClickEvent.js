'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * 创建schema，这个schema对应的数据将用来记录用户的网页点击操作
 * @type {Schema}
 */
const ClickEventSchema = new Schema({
  url: {
    type: String,
    trim: true,
    index: true
  },
  element_id: {
    type: String,
    index: true
  },
  element_classname: {
    type: String,
    index: true
  },
  time: {
    type: Date,
    default: Date.now
  },
  x: {
    type: Number,
    index: true
  },
  y: {
    type: Number,
    index: true
  },
  story: {
    type: Schema.Types.ObjectId,
    // required: true,
    ref: 'Story'
  }
})

/**
 * 创建模型
 */
const model = mongoose.model('Clickevent', ClickEventSchema);

module.exports = model;