"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var PortfolioIcon = function PortfolioIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M8.83 17h6.34a3.001 3.001 0 1 1 0 2H8.83a3.001 3.001 0 1 1 0-2zM3 5c0-1.105.895-2 1.994-2h12.012C18.107 3 19 3.888 19 5c0 1.105-.895 2-1.994 2H4.994A1.992 1.992 0 0 1 3 5zm5 6a2 2 0 0 1 2.003-2h8.994a2 2 0 1 1 0 4h-8.994A1.996 1.996 0 0 1 8 11z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

PortfolioIcon.displayName = 'PortfolioIcon';
var _default = PortfolioIcon;
exports.default = _default;