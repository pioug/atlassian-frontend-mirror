/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::28ab7079c96146d7816d2f4365b5e18c>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _heart = _interopRequireDefault(require("@atlaskit/icon/core/heart"));
var _symbols = _interopRequireDefault(require("@atlaskit/icon/glyph/emoji/symbols"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for HeartIcon.
 * This component is HeartIcon, with `UNSAFE_fallbackIcon` set to "EmojiSymbolsIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: emoji symbols in Editor.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const HeartIcon = props => /*#__PURE__*/_react.default.createElement(_heart.default, Object.assign({
  LEGACY_fallbackIcon: _symbols.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
HeartIcon.Name = 'HeartIconMigration';
var _default = exports.default = HeartIcon;