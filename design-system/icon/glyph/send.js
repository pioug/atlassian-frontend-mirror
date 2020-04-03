"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var SendIcon = function SendIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill=\"currentColor\"><path d=\"M6.978 19.477c0 1.371 1.645 2.042 2.577 1.05L21.558 7.723C22.518 6.695 21.803 5 20.409 5H3.496C2.178 5 1.505 6.607 2.418 7.572l4.56 4.828v7.077zm1.993-1.265v-6.627L3.856 6.169c.303.322.078.857-.36.857h15.963L8.971 18.212z\"/><path d=\"M8.416 12.902l4.01-1.95a1.04 1.04 0 0 0 .474-1.365.982.982 0 0 0-1.324-.489l-4.01 1.95c-.497.242-.71.853-.475 1.364a.982.982 0 0 0 1.325.49z\"/></g></svg>"
  }, props));
};

SendIcon.displayName = 'SendIcon';
var _default = SendIcon;
exports.default = _default;