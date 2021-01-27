"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const SettingsIcon = props => /*#__PURE__*/_react.default.createElement(_Icon.default, _extends({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><path d="M11.701 16.7a5.002 5.002 0 110-10.003 5.002 5.002 0 010 10.004m8.368-3.117a1.995 1.995 0 01-1.346-1.885c0-.876.563-1.613 1.345-1.885a.48.48 0 00.315-.574 8.947 8.947 0 00-.836-1.993.477.477 0 00-.598-.195 2.04 2.04 0 01-1.29.08 1.988 1.988 0 01-1.404-1.395 2.04 2.04 0 01.076-1.297.478.478 0 00-.196-.597 8.98 8.98 0 00-1.975-.826.479.479 0 00-.574.314 1.995 1.995 0 01-1.885 1.346 1.994 1.994 0 01-1.884-1.345.482.482 0 00-.575-.315c-.708.2-1.379.485-2.004.842a.47.47 0 00-.198.582A2.002 2.002 0 014.445 7.06a.478.478 0 00-.595.196 8.946 8.946 0 00-.833 1.994.48.48 0 00.308.572 1.995 1.995 0 011.323 1.877c0 .867-.552 1.599-1.324 1.877a.479.479 0 00-.308.57 8.99 8.99 0 00.723 1.79.477.477 0 00.624.194c.595-.273 1.343-.264 2.104.238.117.077.225.185.302.3.527.8.512 1.58.198 2.188a.473.473 0 00.168.628 8.946 8.946 0 002.11.897.474.474 0 00.57-.313 1.995 1.995 0 011.886-1.353c.878 0 1.618.567 1.887 1.353a.475.475 0 00.57.313 8.964 8.964 0 002.084-.883.473.473 0 00.167-.631c-.318-.608-.337-1.393.191-2.195.077-.116.185-.225.302-.302.772-.511 1.527-.513 2.125-.23a.477.477 0 00.628-.19 8.925 8.925 0 00.728-1.793.478.478 0 00-.314-.573" fill="currentColor" fill-rule="evenodd"/></svg>`
}, props));

SettingsIcon.displayName = 'SettingsIcon';
var _default = SettingsIcon;
exports.default = _default;