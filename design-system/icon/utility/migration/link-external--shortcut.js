/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::a41215229d98a4fba1f785cc0d738eb3>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _linkExternal = _interopRequireDefault(require("@atlaskit/icon/utility/link-external"));
var _shortcut = _interopRequireDefault(require("@atlaskit/icon/glyph/shortcut"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for LinkExternalIcon.
 * This component is LinkExternalIcon, with `UNSAFE_fallbackIcon` set to "ShortcutIcon".
 *
 * Category: utility
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for links that open up a new tab as a secondary/tertiary action.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const LinkExternalIcon = props => /*#__PURE__*/_react.default.createElement(_linkExternal.default, Object.assign({
  LEGACY_fallbackIcon: _shortcut.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
LinkExternalIcon.Name = 'LinkExternalIconMigration';
var _default = exports.default = LinkExternalIcon;