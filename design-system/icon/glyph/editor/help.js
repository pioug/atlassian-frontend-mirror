"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EditorHelpIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M8 10h2.5c0-2 1.5-2 1.5-2 1.5 0 2.5 1.5.5 3-1.5 1-1.5 1.5-1.5 3 0 .144-.016.824 0 1h2c0-1.568 0-2 1.5-3 1.446-.964 1.5-1.896 1.5-3 0-2-1.5-3-4-3-2 0-4 1-4 4zm5 8v-2h-2v2h2z" fill="currentColor" fill-rule="evenodd"/></svg>`
}, props));

EditorHelpIcon.displayName = 'EditorHelpIcon';
var _default = EditorHelpIcon;
exports.default = _default;