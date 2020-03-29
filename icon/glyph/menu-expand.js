"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var MenuExpandIcon = function MenuExpandIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M6 12c0-.552.456-1 1.002-1h9.996a.999.999 0 1 1 0 2H7.002A.999.999 0 0 1 6 12zm0 4c0-.552.456-1 1.002-1h9.996a.999.999 0 1 1 0 2H7.002A.999.999 0 0 1 6 16zm0-8c0-.552.456-1 1.002-1h9.996a.999.999 0 1 1 0 2H7.002A.999.999 0 0 1 6 8z\" fill=\"currentColor\"/></svg>"
  }, props));
};

MenuExpandIcon.displayName = 'MenuExpandIcon';
var _default = MenuExpandIcon;
exports.default = _default;