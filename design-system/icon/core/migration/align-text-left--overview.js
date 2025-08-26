/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::7aab8197b237f515d8ca00469704ecbb>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _alignTextLeft = _interopRequireDefault(require("@atlaskit/icon/core/align-text-left"));
var _overview = _interopRequireDefault(require("@atlaskit/icon/glyph/overview"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for AlignTextLeftIcon.
 * This component is AlignTextLeftIcon, with `UNSAFE_fallbackIcon` set to "OverviewIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: align text left, align content left, summary.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const AlignTextLeftIcon = props => /*#__PURE__*/_react.default.createElement(_alignTextLeft.default, Object.assign({
  name: "AlignTextLeftIcon",
  LEGACY_fallbackIcon: _overview.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
AlignTextLeftIcon.displayName = 'AlignTextLeftIconMigration';
var _default = exports.default = AlignTextLeftIcon;