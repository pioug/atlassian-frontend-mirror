"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Branch24Icon = function Branch24Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path fill=\"#2684FF\" fill-rule=\"evenodd\" d=\"M9 15.17V8.83a3.001 3.001 0 1 0-2 0v6.34A3.001 3.001 0 1 0 10.83 19H15a3 3 0 0 0 3-3v-2.308a3.001 3.001 0 1 0-2 0V16a1 1 0 0 1-1 1h-4.17A3.008 3.008 0 0 0 9 15.17zM3 0h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3zm5 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm9 4.862a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM8 19a1 1 0 1 1 0-2 1 1 0 0 1 0 2z\"/></svg>"
  }, props, {
    size: "medium"
  }));
};

Branch24Icon.displayName = 'Branch24Icon';
var _default = Branch24Icon;
exports.default = _default;