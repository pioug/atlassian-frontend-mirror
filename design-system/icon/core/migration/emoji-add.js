/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::95f27cca6331f80ea54ba7408a97a553>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _emojiAdd = _interopRequireDefault(require("@atlaskit/icon/core/emoji-add"));
var _emojiAdd2 = _interopRequireDefault(require("@atlaskit/icon/glyph/emoji-add"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for EmojiAddIcon.
 * This component is EmojiAddIcon, with `UNSAFE_fallbackIcon` set to "EmojiAddIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for adding an emoji reaction.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const EmojiAddIcon = props => /*#__PURE__*/_react.default.createElement(_emojiAdd.default, Object.assign({
  LEGACY_fallbackIcon: _emojiAdd2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
EmojiAddIcon.Name = 'EmojiAddIconMigration';
var _default = exports.default = EmojiAddIcon;