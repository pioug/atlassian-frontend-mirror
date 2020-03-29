"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var GoogledriveIcon = function GoogledriveIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M15.81 3l-6.776.068 5.846 10.126 6.777-.07L15.811 3zM2 14.315l3.447 5.835 5.846-10.126L7.846 4.19 2 14.315zm8.307.175l-3.33 5.902H18.67L22 14.49H10.307z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

GoogledriveIcon.displayName = 'GoogledriveIcon';
var _default = GoogledriveIcon;
exports.default = _default;