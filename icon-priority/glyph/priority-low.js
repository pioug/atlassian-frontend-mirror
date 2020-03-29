"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var PriorityLowIcon = function PriorityLowIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M11.996 13.861l6.454-3.865a1 1 0 1 1 1.027 1.716l-6.97 4.174a1 1 0 0 1-1.03-.002L4.57 11.71A1 1 0 0 1 5.606 10l6.39 3.862z\" fill=\"#0065FF\"/></svg>"
  }, props));
};

PriorityLowIcon.displayName = 'PriorityLowIcon';
var _default = PriorityLowIcon;
exports.default = _default;