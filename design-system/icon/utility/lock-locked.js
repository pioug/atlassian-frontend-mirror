"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _UNSAFE_baseNew = _interopRequireDefault(require("@atlaskit/icon/UNSAFE_base-new"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Icon: "LockLocked".
 * Category: Multi-purpose
 * Location: ADS
 * Usage guidance: Reserved for indicating something is locked in the side navigation Menu Item.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const LockLockedIcon = props => /*#__PURE__*/_react.default.createElement(_UNSAFE_baseNew.default, Object.assign({
  dangerouslySetGlyph: `<path fill="currentColor" d="M8.813 11.25c.517 0 .937-.42.937-.937V6.687a.937.937 0 0 0-.937-.937H3.188a.937.937 0 0 0-.938.938v3.625c0 .517.42.937.938.937z"/><path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="M3.75 5.75h-.562a.937.937 0 0 0-.938.938v3.625c0 .517.42.937.938.937h5.624c.518 0 .938-.42.938-.937V6.687a.937.937 0 0 0-.937-.937H8.25m-4.5 0V3a2.25 2.25 0 0 1 4.5 0v2.75m-4.5 0h4.5"/>`,
  type: 'utility'
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
LockLockedIcon.displayName = 'LockLockedIcon';
var _default = exports.default = LockLockedIcon;