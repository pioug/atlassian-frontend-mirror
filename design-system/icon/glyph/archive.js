"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var ArchiveIcon = function ArchiveIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path fill=\"#fff\" fill-opacity=\".01\" d=\"M0 0h24v24H0z\"/><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M19 3H4.85A2 2 0 0 0 3 5v4h1v10.45A1.67 1.67 0 0 0 5.77 21h12.46A1.67 1.67 0 0 0 20 19.45V9h1V5a2 2 0 0 0-2-2zm-1 16H6V9h12v10zm1-12H5V5h14v2zm-4 7H9v-2h6v2z\" fill=\"currentColor\"/></svg>"
  }, props));
};

ArchiveIcon.displayName = 'ArchiveIcon';
var _default = ArchiveIcon;
exports.default = _default;