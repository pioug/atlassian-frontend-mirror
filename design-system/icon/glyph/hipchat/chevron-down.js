"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _base = require("@atlaskit/icon/base");
var _chevronDown = _interopRequireDefault(require("@atlaskit/icon/utility/chevron-down"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const HipchatChevronDownIcon = props => /*#__PURE__*/_react.default.createElement(_base.UNSAFE_IconFacade, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="currentColor" d="M6.744 8.744a1.053 1.053 0 0 0 0 1.49l4.547 4.557a1 1 0 0 0 1.416 0l4.55-4.558a1.051 1.051 0 1 0-1.488-1.488l-3.77 3.776-3.768-3.776a1.05 1.05 0 0 0-1.487 0"/></svg>`
}, props, {
  newIcon: _chevronDown.default,
  iconType: "utility"
}));
HipchatChevronDownIcon.displayName = 'HipchatChevronDownIcon';
var _default = exports.default = HipchatChevronDownIcon;