"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var BitbucketSourceIcon = function BitbucketSourceIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M8.852 6.743l-4.558 4.548a1 1 0 0 0-.001 1.415v.001l4.559 4.549a1.052 1.052 0 0 0 1.489-1.486l-.001-.001-3.775-3.77 3.775-3.768a1.051 1.051 0 0 0 .002-1.486l-.001-.001a1.052 1.052 0 0 0-1.489-.001zm4.806.001a1.05 1.05 0 0 0 0 1.486v.001L17.435 12l-3.776 3.769a1.05 1.05 0 0 0 0 1.487 1.052 1.052 0 0 0 1.488 0l4.558-4.547a1 1 0 0 0 .001-1.414v-.002l-4.559-4.55a1.05 1.05 0 0 0-.744-.307 1.05 1.05 0 0 0-.745.308z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

BitbucketSourceIcon.displayName = 'BitbucketSourceIcon';
var _default = BitbucketSourceIcon;
exports.default = _default;