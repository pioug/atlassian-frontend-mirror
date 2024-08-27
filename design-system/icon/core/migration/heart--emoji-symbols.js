/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::d092721c4d0e438ac48889feda75ddf2>>
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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
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