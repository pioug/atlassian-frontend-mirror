"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _base = require("@atlaskit/icon/base");
var _flag = _interopRequireDefault(require("@atlaskit/icon/core/flag"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const EmojiFlagsIcon = props => /*#__PURE__*/_react.default.createElement(_base.IconFacade, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="currentcolor" fill-rule="evenodd" d="M6 12.235v6.446c0 .537.45.977 1 .977s1-.44 1-.977v-5.778c1.17-.341 2.389-.045 3.768.29.982.238 2.036.495 3.13.495a5.7 5.7 0 0 0 2.547-.567 1 1 0 0 0 .563-.9V5.466a.998.998 0 0 0-1.437-.9c-1.345.654-2.731.317-4.331-.071-1.729-.42-3.687-.895-5.678.072A1 1 0 0 0 6 5.466zm3.111-1.48c1.094 0 2.148.256 3.129.495 1.381.335 2.6.63 3.768.289V6.836c-1.488.27-2.93-.08-4.24-.398-1.379-.335-2.598-.632-3.768-.29v4.704a6 6 0 0 1 1.111-.097"/></svg>`
}, props, {
  newIcon: _flag.default
}));
EmojiFlagsIcon.displayName = 'EmojiFlagsIcon';
var _default = exports.default = EmojiFlagsIcon;