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
 * Icon: "Copy".
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for copying data such as text, code or other objects.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CopyIcon = props => /*#__PURE__*/_react.default.createElement(_UNSAFE_baseNew.default, Object.assign({
  dangerouslySetGlyph: `<path stroke="currentColor" stroke-width="1.5" d="M1.75 3c0-.69.56-1.25 1.25-1.25h8c.69 0 1.25.56 1.25 1.25v8c0 .69-.56 1.25-1.25 1.25H3c-.69 0-1.25-.56-1.25-1.25z"/><path stroke="currentColor" stroke-width="1.5" d="M6 15.25h6.75a2.5 2.5 0 0 0 2.5-2.5V6"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CopyIcon.displayName = 'CopyIcon';
var _default = exports.default = CopyIcon;