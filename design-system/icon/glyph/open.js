"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var OpenIcon = function OpenIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill=\"currentColor\" fill-rule=\"evenodd\"><path d=\"M11.031 7A1.03 1.03 0 0 0 10 8.036a1.05 1.05 0 0 0 1.044 1.045l3.121.014.014 3.121a1.05 1.05 0 0 0 1.045 1.044 1.03 1.03 0 0 0 1.036-1.035l-.019-4.161a1.053 1.053 0 0 0-1.045-1.045L11.035 7h-.004z\"/><path d=\"M13.364 8.292l-7.072 7.071a1.002 1.002 0 0 0 0 1.415c.39.39 1.024.39 1.415 0l7.071-7.071A1.002 1.002 0 0 0 14.071 8a1 1 0 0 0-.707.292z\"/></g></svg>"
  }, props));
};

OpenIcon.displayName = 'OpenIcon';
var _default = OpenIcon;
exports.default = _default;