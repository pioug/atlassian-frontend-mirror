/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::00a0943309a341314cd2b5c396c07e0c>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _emoji = _interopRequireDefault(require("@atlaskit/icon/core/emoji"));
var _emoji2 = _interopRequireDefault(require("@atlaskit/icon/glyph/emoji/emoji"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for EmojiIcon.
 * This component is EmojiIcon, with `UNSAFE_fallbackIcon` set to "EmojiEmojiIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for Editor as a category for Emoji's.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const EmojiIcon = props => /*#__PURE__*/_react.default.createElement(_emoji.default, Object.assign({
  LEGACY_fallbackIcon: _emoji2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
EmojiIcon.Name = 'EmojiIconMigration';
var _default = exports.default = EmojiIcon;