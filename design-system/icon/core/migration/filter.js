/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::132546b2029374580f662a7cc2e5b182>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _filter = _interopRequireDefault(require("@atlaskit/icon/core/filter"));
var _filter2 = _interopRequireDefault(require("@atlaskit/icon/glyph/filter"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for FilterIcon.
 * This component is FilterIcon, with `UNSAFE_fallbackIcon` set to "FilterIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for filterting data or objects.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const FilterIcon = props => /*#__PURE__*/_react.default.createElement(_filter.default, Object.assign({
  LEGACY_fallbackIcon: _filter2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
FilterIcon.Name = 'FilterIconMigration';
var _default = exports.default = FilterIcon;