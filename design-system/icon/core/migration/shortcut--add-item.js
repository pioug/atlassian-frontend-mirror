/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::02ea75acda0ebaf976f16435f9f016d2>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _shortcut = _interopRequireDefault(require("@atlaskit/icon/core/shortcut"));
var _addItem = _interopRequireDefault(require("@atlaskit/icon/glyph/add-item"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for ShortcutIcon.
 * This component is ShortcutIcon, with `UNSAFE_fallbackIcon` set to "AddItemIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for shortcuts in Jira.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ShortcutIcon = props => /*#__PURE__*/_react.default.createElement(_shortcut.default, Object.assign({
  name: "ShortcutIcon",
  LEGACY_fallbackIcon: _addItem.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ShortcutIcon.displayName = 'ShortcutIconMigration';
var _default = exports.default = ShortcutIcon;