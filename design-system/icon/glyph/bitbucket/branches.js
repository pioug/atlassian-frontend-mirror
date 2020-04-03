"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var BitbucketBranchesIcon = function BitbucketBranchesIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M19 11c0 1.3-.8 2.4-2 2.8V15c0 2.2-1.8 4-4 4h-2.2c-.4 1.2-1.5 2-2.8 2-1.7 0-3-1.3-3-3 0-1.3.8-2.4 2-2.8V8.8C5.9 8.4 5 7.3 5 6c0-1.7 1.3-3 3-3s3 1.3 3 3c0 1.3-.8 2.4-2.1 2.8v6.4c.9.3 1.6.9 1.9 1.8H13c1.1 0 2-.9 2-2v-1.2c-1.2-.4-2-1.5-2-2.8 0-1.7 1.3-3 3-3s3 1.3 3 3zM8 5c-.5 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm8 7c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zm-8 7c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

BitbucketBranchesIcon.displayName = 'BitbucketBranchesIcon';
var _default = BitbucketBranchesIcon;
exports.default = _default;