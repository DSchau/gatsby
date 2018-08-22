/* eslint-disable */
const path = require('path');

exports.createPages = function createPages({ boundActionCreators }) {
  const { createPage } = boundActionCreators;

  createPage({
    component: path.resolve('src/templates/sample.js'),
    path: '/sup'
  });
};
