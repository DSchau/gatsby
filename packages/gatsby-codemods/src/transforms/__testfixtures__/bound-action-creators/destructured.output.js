/* eslint-disable */
const path = require('path');

exports.createPages = function createPages({ actions }) {
  const { createPage } = actions;

  createPage({
    component: path.resolve('src/templates/sample.js'),
    path: '/sup'
  });
};