"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var PriorityMajorIcon = function PriorityMajorIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M12.02 5.187L5.567 9.05A1 1 0 1 1 4.54 7.335l6.97-4.173a1 1 0 0 1 1.03.002l6.906 4.173A1 1 0 1 1 18.41 9.05l-6.39-3.862z\" fill=\"#FF5630\"/><path d=\"M5.567 15.054a1 1 0 1 1-1.027-1.716l6.97-4.174a1 1 0 0 1 1.03.002l6.906 4.174a1 1 0 1 1-1.035 1.712l-6.39-3.863-6.454 3.865z\" fill=\"#FF7452\"/><path d=\"M5.567 21.068a1 1 0 1 1-1.027-1.716l6.97-4.174a1 1 0 0 1 1.03.002l6.906 4.174a1 1 0 1 1-1.035 1.712l-6.39-3.863-6.454 3.865z\" fill=\"#FF8F73\"/></svg>"
  }, props));
};

PriorityMajorIcon.displayName = 'PriorityMajorIcon';
var _default = PriorityMajorIcon;
exports.default = _default;