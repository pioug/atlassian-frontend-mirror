"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var HomeCircleIcon = function HomeCircleIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M10.5 16H9a1 1 0 0 1-1-1v-4.946l3.28-3.379.021-.021a1 1 0 0 1 1.414.021L16 10.059V15a1 1 0 0 1-1 1h-1.5v-2.5a1.5 1.5 0 0 0-3 0V16zm7.5-3.936a1 1 0 0 0 1.215-1.564L14.15 5.282a3 3 0 0 0-4.242-.063l-.063.063L4.78 10.5A1 1 0 0 0 6 12.061V15a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-2.936zM12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

HomeCircleIcon.displayName = 'HomeCircleIcon';
var _default = HomeCircleIcon;
exports.default = _default;