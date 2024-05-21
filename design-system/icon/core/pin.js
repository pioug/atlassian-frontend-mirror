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
 * Icon: "Pin".
 * Category: Multi-purpose
 * Location: ADS
 * Usage guidance: Known uses: pinning Jira issue fields.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const PinIcon = props => /*#__PURE__*/_react.default.createElement(_UNSAFE_baseNew.default, Object.assign({
  dangerouslySetGlyph: `<path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="M8 11.75h5.25c0-.75-.084-1.14-.75-2.25-.75-1.247-2-1.25-2-1.75V3.018c0-.268.353-.567.752-1.02.438-.498.25-1.248 0-1.248H4.75c-.25 0-.427.817 0 1.247.375.378.75.753.75 1.021V7.75c0 .5-1.25.5-2 1.75-.546.91-.75 1.5-.75 2.25zm0 0V16"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
PinIcon.displayName = 'PinIcon';
var _default = exports.default = PinIcon;