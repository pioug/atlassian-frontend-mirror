/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::5263752ab7d6d0b624b02ca95af4129a>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _bookWithBookmark = _interopRequireDefault(require("@atlaskit/icon/core/book-with-bookmark"));
var _book = _interopRequireDefault(require("@atlaskit/icon/glyph/book"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for BookWithBookmarkIcon.
 * This component is BookWithBookmarkIcon, with `UNSAFE_fallbackIcon` set to "BookIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: knowledge bases, articles, and other representations of books or info.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const BookWithBookmarkIcon = props => /*#__PURE__*/_react.default.createElement(_bookWithBookmark.default, Object.assign({
  LEGACY_fallbackIcon: _book.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
BookWithBookmarkIcon.Name = 'BookWithBookmarkIconMigration';
var _default = exports.default = BookWithBookmarkIcon;