"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var PriorityLowestIcon = function PriorityLowestIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M18.46 11.936a1 1 0 1 1 1.028 1.716l-6.97 4.174a1 1 0 0 1-1.03-.002L4.581 13.65a1 1 0 0 1 1.034-1.711l6.391 3.862 6.454-3.865z\" fill=\"#0065FF\"/><path d=\"M12.007 9.798l6.454-3.864a1 1 0 0 1 1.027 1.716l-6.97 4.173a1 1 0 0 1-1.03-.002L4.581 7.648a1 1 0 0 1 1.034-1.712l6.391 3.862z\" fill=\"#2684FF\"/></svg>"
  }, props));
};

PriorityLowestIcon.displayName = 'PriorityLowestIcon';
var _default = PriorityLowestIcon;
exports.default = _default;