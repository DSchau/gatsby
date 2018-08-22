/* eslint-disable */
const path = require('path');

exports.createPages = function createPages(api) {
  const { createPage } = api.actions;

  createPage({
    component: path.resolve('src/templates/sample.js'),
    path: '/sup'
  });
};
