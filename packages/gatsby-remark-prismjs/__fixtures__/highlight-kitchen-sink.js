"use strict"

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard")

exports.__esModule = true
exports.default = void 0

var _defineProperty2 = _interopRequireDefault(
  require("@babel/runtime/helpers/defineProperty")
)

var _react = _interopRequireWildcard(require("react"))

var _jsxFileName =
  "/Users/dschau/Code/Work/gatsby/gatsby/packages/gatsby-remark-prismjs/src/__fixtures__/highlight-kitchen-sink.js"

// highlight-line
class Counter extends _react.Component {
  constructor(...args) {
    super(...args)
    ;(0, _defineProperty2.default)(this, "state", {
      count: 0, // highlight-end
    })
    ;(0, _defineProperty2.default)(this, "updateCount", () => {
      this.setState(state => ({
        // highlight-next-line
        count: state.count + 1,
      }))
    })
  }

  render() {
    const { count } = this.state // highlight-line

    return _react.default.createElement(
      "div",
      {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 20,
        },
        __self: this,
      },
      _react.default.createElement(
        "span",
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 21,
          },
          __self: this,
        },
        "clicked ",
        count
      ),
      _react.default.createElement(
        "button",
        {
          onClick: this.updateCount,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 23,
          },
          __self: this,
        },
        "Click me"
      )
    )
  }
}

exports.default = Counter
