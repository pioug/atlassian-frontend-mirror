/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::8e9a267689005b029b2d6cc1c6a1170b>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _filter = _interopRequireDefault(require("@atlaskit/icon/core/filter"));
var _filter2 = _interopRequireDefault(require("@atlaskit/icon/glyph/media-services/filter"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for FilterIcon.
 * This component is FilterIcon, with `UNSAFE_fallbackIcon` set to "MediaServicesFilterIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for filterting data or objects.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const FilterIcon = props => /*#__PURE__*/_react.default.createElement(_filter.default, Object.assign({
  name: "FilterIcon",
  LEGACY_fallbackIcon: _filter2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
FilterIcon.displayName = 'FilterIconMigration';
var _default = exports.default = FilterIcon;