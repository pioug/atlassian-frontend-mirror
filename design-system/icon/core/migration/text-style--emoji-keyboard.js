/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::4c233746bd487a6e34541b8d93fb3d1b>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _textStyle = _interopRequireDefault(require("@atlaskit/icon/core/text-style"));
var _keyboard = _interopRequireDefault(require("@atlaskit/icon/glyph/emoji/keyboard"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for TextStyleIcon.
 * This component is TextStyleIcon, with `UNSAFE_fallbackIcon` set to "EmojiKeyboardIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for text styles in Editor.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const TextStyleIcon = props => /*#__PURE__*/_react.default.createElement(_textStyle.default, Object.assign({
  LEGACY_fallbackIcon: _keyboard.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
TextStyleIcon.Name = 'TextStyleIconMigration';
var _default = exports.default = TextStyleIcon;