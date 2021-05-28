"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PdfIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill-rule="evenodd"><rect fill="currentColor" x="5" y="4" width="14" height="16" rx="2"/><rect fill="inherit" x="8" y="8" width="8" height="2" rx="1"/><path d="M15.512 16H13.49a.492.492 0 01-.489-.497v-4.006c0-.275.218-.497.489-.497h2.023c.27 0 .488.222.488.497v4.006a.492.492 0 01-.488.497" fill="inherit"/><rect fill="inherit" x="8" y="11" width="4" height="2" rx="1"/><rect fill="inherit" x="8" y="14" width="4" height="2" rx="1"/></g></svg>`
}, props));

PdfIcon.displayName = 'PdfIcon';
var _default = PdfIcon;
exports.default = _default;