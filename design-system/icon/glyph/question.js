"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const QuestionIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentColor" fill-rule="evenodd"><path d="M12 18a1 1 0 010-2 1 1 0 010 2m-2-9a1 1 0 11-2 0 1 1 0 012 0"/><path d="M15.89 8.048a3.971 3.971 0 00-2.951-2.94A4.005 4.005 0 008 9.087a.073.073 0 00.009.008l1.878.022.112-.116A2.002 2.002 0 0112 7c1.103 0 2 .897 2 2 0 1.102-.897 2-2 2h.008a1 1 0 00-.998.987v2.014a1 1 0 102 0v-.782c0-.217.145-.399.349-.472a3.991 3.991 0 002.53-4.699"/></g></svg>`
}, props));

QuestionIcon.displayName = 'QuestionIcon';
var _default = QuestionIcon;
exports.default = _default;