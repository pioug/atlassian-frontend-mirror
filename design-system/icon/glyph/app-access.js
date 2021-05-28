"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const AppAccessIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill-rule="evenodd"><path d="M12.682 12H5.01A2.006 2.006 0 003 14v4.446c0 2.162 4.836 2.951 8.368 2.368A5.975 5.975 0 0110 17a5.994 5.994 0 012.682-5z" fill="currentColor"/><circle fill="currentColor" cx="9" cy="7" r="4"/><circle fill="currentColor" cx="16" cy="17" r="5"/><path d="M14.674 19.331c.36.36.941.36 1.3 0l2.758-2.763a.92.92 0 00-1.301-1.298l-2.108 2.11-.755-.754a.92.92 0 00-1.3 1.3l1.406 1.405z" fill="inherit"/></g></svg>`
}, props));

AppAccessIcon.displayName = 'AppAccessIcon';
var _default = AppAccessIcon;
exports.default = _default;