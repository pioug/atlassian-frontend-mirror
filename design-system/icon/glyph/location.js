"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var LocationIcon = function LocationIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M12 21c-2.28 0-6-8.686-6-12a6 6 0 1 1 12 0c0 3.314-3.72 12-6 12zm0-9a2.912 2.912 0 1 0 0-5.824A2.912 2.912 0 0 0 12 12z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

LocationIcon.displayName = 'LocationIcon';
var _default = LocationIcon;
exports.default = _default;