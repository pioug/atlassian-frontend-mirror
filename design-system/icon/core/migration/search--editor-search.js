"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _search = _interopRequireDefault(require("@atlaskit/icon/core/search"));
var _search2 = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/search"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for SearchIcon.
 * This component is SearchIcon, with `UNSAFE_fallbackIcon` set to "EditorSearchIcon".
 *
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for searching objects.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const SearchIcon = props => /*#__PURE__*/_react.default.createElement(_search.default, Object.assign({
  LEGACY_fallbackIcon: _search2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
SearchIcon.Name = 'SearchIconMigration';
var _default = exports.default = SearchIcon;