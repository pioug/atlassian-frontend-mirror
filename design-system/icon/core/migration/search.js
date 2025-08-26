/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::b3602767f41c26f522cef3955cde6c4d>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _search = _interopRequireDefault(require("@atlaskit/icon/core/search"));
var _search2 = _interopRequireDefault(require("@atlaskit/icon/glyph/search"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for SearchIcon.
 * This component is SearchIcon, with `UNSAFE_fallbackIcon` set to "SearchIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for searching objects.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const SearchIcon = props => /*#__PURE__*/_react.default.createElement(_search.default, Object.assign({
  name: "SearchIcon",
  LEGACY_fallbackIcon: _search2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
SearchIcon.displayName = 'SearchIconMigration';
var _default = exports.default = SearchIcon;