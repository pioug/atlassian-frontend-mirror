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
 * Icon: "Shortcut".
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for shortcuts in Jira.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ShortcutIcon = props => /*#__PURE__*/_react.default.createElement(_UNSAFE_baseNew.default, Object.assign({
  dangerouslySetGlyph: `<path stroke="currentColor" stroke-width="1.5" d="M14.25 8.5V13c0 .69-.56 1.25-1.25 1.25H3c-.69 0-1.25-.56-1.25-1.25V3c0-.69.56-1.25 1.25-1.25h4.5M13 0v3m0 0v3m0-3h-3m3 0h3"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ShortcutIcon.displayName = 'ShortcutIcon';
var _default = exports.default = ShortcutIcon;