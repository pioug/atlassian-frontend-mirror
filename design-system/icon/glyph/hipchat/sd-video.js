"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var HipchatSdVideoIcon = function HipchatSdVideoIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M21 7c.523 0 1 .395 1 .94v8.12c0 .545-.477.94-1 .94-.157 0-.318-.035-.47-.112L17 15.118V8.873l3.531-1.763c.152-.075.312-.11.469-.11zM3.998 6H14a2 2 0 0 1 2 2.003v7.995A2 2 0 0 1 14.001 18H4a2 2 0 0 1-2-2.002V8.003A2 2 0 0 1 3.999 6z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

HipchatSdVideoIcon.displayName = 'HipchatSdVideoIcon';
var _default = HipchatSdVideoIcon;
exports.default = _default;