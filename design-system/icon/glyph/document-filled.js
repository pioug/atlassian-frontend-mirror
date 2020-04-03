"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var DocumentFilledIcon = function DocumentFilledIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M18.99 8.99l.01 1.015V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.275c.469 0 .922.164 1.282.464L18.631 7.7c.227.19.359.471.359.768v.521zM12.02 5L12 8.192a.99.99 0 0 0 .994.991h4L12.02 5z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

DocumentFilledIcon.displayName = 'DocumentFilledIcon';
var _default = DocumentFilledIcon;
exports.default = _default;