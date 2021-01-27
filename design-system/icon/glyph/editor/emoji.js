"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const EditorEmojiIcon = props => /*#__PURE__*/_react.default.createElement(_Icon.default, _extends({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><path d="M12 5a7 7 0 110 14 7 7 0 010-14zm0 12.5c3.033 0 5.5-2.467 5.5-5.5S15.033 6.5 12 6.5A5.506 5.506 0 006.5 12c0 3.033 2.467 5.5 5.5 5.5zm-1.5-6a1 1 0 110-2 1 1 0 010 2zm3 0a1 1 0 110-2 1 1 0 010 2zm.27 1.583a.626.626 0 01.932.834A3.63 3.63 0 0112 15.125a3.63 3.63 0 01-2.698-1.204.625.625 0 01.93-.835c.901 1.003 2.639 1.003 3.538-.003z" fill="currentColor" fill-rule="evenodd"/></svg>`
}, props));

EditorEmojiIcon.displayName = 'EditorEmojiIcon';
var _default = EditorEmojiIcon;
exports.default = _default;