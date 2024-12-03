/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::22804d8e00d14c838ac62e64e10351c7>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _baseNew = _interopRequireDefault(require("@atlaskit/icon/base-new"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 * Please reach out in #icon-contributions before using these in production.
 *
 * Icon: "Shortcut".
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for shortcuts in Jira.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ShortcutIcon = props => /*#__PURE__*/_react.default.createElement(_baseNew.default, Object.assign({
  dangerouslySetGlyph: `<path stroke="currentcolor" stroke-width="1.5" d="M14.25 8.5V13c0 .69-.56 1.25-1.25 1.25H3c-.69 0-1.25-.56-1.25-1.25V3c0-.69.56-1.25 1.25-1.25h4.5M13 0v3m0 0v3m0-3h-3m3 0h3"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ShortcutIcon.displayName = 'ShortcutIcon';
var _default = exports.default = ShortcutIcon;