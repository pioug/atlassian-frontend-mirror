"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var SuitcaseIcon = function SuitcaseIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M17 14h2V9H5v5h2v-1a1 1 0 0 1 2 0v1h6v-1a1 1 0 0 1 2 0v1zm0 2v1a1 1 0 0 1-2 0v-1H9v1a1 1 0 0 1-2 0v-1H5v3h14v-3h-2zM9 7h6V6H9v1zM7 7V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2z\"/></svg>"
  }, props));
};

SuitcaseIcon.displayName = 'SuitcaseIcon';
var _default = SuitcaseIcon;
exports.default = _default;