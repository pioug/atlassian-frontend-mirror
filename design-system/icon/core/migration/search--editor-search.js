/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::b2d61a8b9264c17f51d6b1ce92a21fc9>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _search = _interopRequireDefault(require("@atlaskit/icon/core/search"));
var _search2 = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/search"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for SearchIcon.
 * This component is SearchIcon, with `UNSAFE_fallbackIcon` set to "EditorSearchIcon".
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