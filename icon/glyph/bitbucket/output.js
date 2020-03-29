"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var BitbucketOutputIcon = function BitbucketOutputIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill=\"currentColor\" fill-rule=\"evenodd\"><path d=\"M7 15v1.994C7 18.103 7.898 19 9.006 19h9.988A2.005 2.005 0 0 0 21 16.994V7.006A2.005 2.005 0 0 0 18.994 5H9.006A2.005 2.005 0 0 0 7 7.006V9h2.003c0-1.175.002-2 .003-2 0 0 9.994.002 9.994.006 0 0-.002 9.994-.006 9.994 0 0-9.994-.002-9.994-.006V15H7z\" fill-rule=\"nonzero\"/><path d=\"M8 6h12v3H8zM4.291 9.293l-1.994 1.995a1 1 0 0 0 0 1.423l1.994 1.997a1.001 1.001 0 0 0 1.413 0c.39-.391.39-1.025 0-1.415L4.412 12l1.292-1.293a1 1 0 0 0-1.413-1.414z\"/><rect x=\"3\" y=\"11\" width=\"12\" height=\"2\" rx=\"1\"/></g></svg>"
  }, props));
};

BitbucketOutputIcon.displayName = 'BitbucketOutputIcon';
var _default = BitbucketOutputIcon;
exports.default = _default;