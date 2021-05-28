"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EditorDecisionIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M9.414 8l3.293 3.293c.187.187.293.442.293.707v5a1 1 0 01-2 0v-4.586l-3-3V10.5a1 1 0 01-2 0V7a1 1 0 011-1h3.5a1 1 0 010 2H9.414zm8.293-1.707a.999.999 0 010 1.414l-2.5 2.5a.997.997 0 01-1.414 0 .999.999 0 010-1.414l2.5-2.5a.999.999 0 011.414 0z" fill="currentColor" fill-rule="evenodd"/></svg>`
}, props));

EditorDecisionIcon.displayName = 'EditorDecisionIcon';
var _default = EditorDecisionIcon;
exports.default = _default;