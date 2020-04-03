"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var HipchatChevronDoubleDownIcon = function HipchatChevronDoubleDownIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M14.302 13.294l-2.308 2.327-2.297-2.317a.986.986 0 0 0-1.405 0 1.009 1.009 0 0 0 0 1.419l2.928 2.955c.214.215.492.322.77.322.28 0 .56-.107.778-.322l2.94-2.965a1.012 1.012 0 0 0 0-1.419.988.988 0 0 0-1.406 0zm0-6l-2.308 2.327-2.297-2.317a.986.986 0 0 0-1.405 0 1.009 1.009 0 0 0 0 1.419l2.928 2.955c.214.215.492.322.77.322.28 0 .56-.107.778-.322l2.94-2.965a1.012 1.012 0 0 0 0-1.419.988.988 0 0 0-1.406 0z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

HipchatChevronDoubleDownIcon.displayName = 'HipchatChevronDoubleDownIcon';
var _default = HipchatChevronDoubleDownIcon;
exports.default = _default;