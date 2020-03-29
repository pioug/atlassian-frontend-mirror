"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var PriorityHighestIcon = function PriorityHighestIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M12.005 8.187l-6.453 3.865a1 1 0 0 1-1.028-1.716l6.97-4.174a1 1 0 0 1 1.031.002l6.906 4.174a1 1 0 1 1-1.035 1.712l-6.39-3.863z\" fill=\"#FF5630\"/><path d=\"M5.552 18.054a1 1 0 1 1-1.028-1.715l6.97-4.174a1 1 0 0 1 1.031.002l6.906 4.174a1 1 0 1 1-1.035 1.711l-6.39-3.862-6.454 3.864z\" fill=\"#FF7452\"/></svg>"
  }, props));
};

PriorityHighestIcon.displayName = 'PriorityHighestIcon';
var _default = PriorityHighestIcon;
exports.default = _default;