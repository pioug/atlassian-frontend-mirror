/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::a56ed314940e96507f3d40e0a0c01e78>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _iconNew = _interopRequireDefault(require("@atlaskit/icon/components/icon-new"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Icon: "Filter".
 * Category: single-purpose
 * Location: @atlaskit/icon/core/filter
 * Usage guidance:
 * Single purpose - Reserved for filterting data or objects.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const FilterIcon = props => /*#__PURE__*/_react.default.createElement(_iconNew.default, Object.assign({
  name: "FilterIcon",
  dangerouslySetGlyph: `<path fill="currentcolor" d="M11 12v1.5H5V12zm2-4.75v1.5H3v-1.5zm2-4.75V4H1V2.5z"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
FilterIcon.displayName = 'FilterIcon';
var _default = exports.default = FilterIcon;