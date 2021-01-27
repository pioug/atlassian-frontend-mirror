"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const EditorPanelIcon = props => /*#__PURE__*/_react.default.createElement(_Icon.default, _extends({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><path d="M12 19a7 7 0 110-14 7 7 0 010 14zm0-1.5a5.5 5.5 0 100-11 5.5 5.5 0 000 11zm0-6a1 1 0 011 1v2a1 1 0 01-2 0v-2a1 1 0 011-1zm0-3a1 1 0 110 2 1 1 0 010-2z" fill="currentColor" fill-rule="evenodd"/></svg>`
}, props));

EditorPanelIcon.displayName = 'EditorPanelIcon';
var _default = EditorPanelIcon;
exports.default = _default;