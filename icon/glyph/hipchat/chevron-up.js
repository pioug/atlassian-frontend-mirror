"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var HipchatChevronUpIcon = function HipchatChevronUpIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M11.294 8.708l-.001.001-4.549 4.559a1.051 1.051 0 1 0 1.486 1.488l.001-.001 3.77-3.776 3.768 3.776a1.05 1.05 0 0 0 1.486.001h.001a1.054 1.054 0 0 0 .001-1.489l-4.548-4.558a1 1 0 0 0-1.415-.001z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

HipchatChevronUpIcon.displayName = 'HipchatChevronUpIcon';
var _default = HipchatChevronUpIcon;
exports.default = _default;