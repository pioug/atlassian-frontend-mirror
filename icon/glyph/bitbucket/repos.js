"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var BitbucketReposIcon = function BitbucketReposIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill=\"currentColor\" fill-rule=\"evenodd\"><path d=\"M5 5v14h14V5H5zm0-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z\" fill-rule=\"nonzero\"/><path d=\"M9.232 8.306l-2.93 2.954a1.056 1.056 0 0 0 0 1.478l2.93 2.956a1.034 1.034 0 0 0 1.465 0 1.05 1.05 0 0 0 0-1.478L8.5 11.999l2.197-2.217a1.048 1.048 0 0 0 0-1.476A1.024 1.024 0 0 0 9.965 8c-.267 0-.53.101-.733.306zm4.072-.001a1.05 1.05 0 0 0 0 1.478L15.5 12l-2.196 2.217a1.05 1.05 0 0 0 0 1.477c.404.408 1.06.408 1.464 0l2.93-2.955a1.054 1.054 0 0 0 0-1.478l-2.93-2.956a1.031 1.031 0 0 0-1.464 0z\"/></g></svg>"
  }, props));
};

BitbucketReposIcon.displayName = 'BitbucketReposIcon';
var _default = BitbucketReposIcon;
exports.default = _default;