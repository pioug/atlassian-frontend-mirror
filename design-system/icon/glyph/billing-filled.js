"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const BillingFilledIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill-rule="evenodd"><path d="M5 3.99C5 2.892 5.897 2 7.006 2h9.988C18.102 2 19 2.898 19 3.99v16.02c0 1.099-.897 1.99-2.006 1.99H7.006A2.003 2.003 0 015 20.01V3.99z" fill="currentColor" fill-rule="nonzero"/><rect fill="inherit" x="8" y="6" width="8" height="2" rx="1"/><rect fill="inherit" x="8" y="9" width="5" height="2" rx="1"/><rect fill="inherit" x="8" y="12" width="5" height="2" rx="1"/><rect fill="inherit" x="8" y="15" width="5" height="2" rx="1"/><rect fill="inherit" x="14" y="12" width="2" height="2" rx="1"/><rect fill="inherit" x="14" y="15" width="2" height="2" rx="1"/><rect fill="inherit" x="14" y="9" width="2" height="2" rx="1"/></g></svg>`
}, props));

BillingFilledIcon.displayName = 'BillingFilledIcon';
var _default = BillingFilledIcon;
exports.default = _default;