/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::25f723f32d19d42c30411b7dea35f5d8>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _growDiagonal = _interopRequireDefault(require("@atlaskit/icon/core/grow-diagonal"));
var _actualSize = _interopRequireDefault(require("@atlaskit/icon/glyph/media-services/actual-size"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for GrowDiagonalIcon.
 * This component is GrowDiagonalIcon, with `UNSAFE_fallbackIcon` set to "MediaServicesActualSizeIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for increasing the size of an element when height and width are changed concurrently.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const GrowDiagonalIcon = props => /*#__PURE__*/_react.default.createElement(_growDiagonal.default, Object.assign({
  LEGACY_fallbackIcon: _actualSize.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
GrowDiagonalIcon.Name = 'GrowDiagonalIconMigration';
var _default = exports.default = GrowDiagonalIcon;