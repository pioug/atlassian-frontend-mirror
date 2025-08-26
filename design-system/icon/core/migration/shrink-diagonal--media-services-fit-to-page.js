/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::245341e514d0c6b4cbda5429c51d41c1>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _shrinkDiagonal = _interopRequireDefault(require("@atlaskit/icon/core/shrink-diagonal"));
var _fitToPage = _interopRequireDefault(require("@atlaskit/icon/glyph/media-services/fit-to-page"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for ShrinkDiagonalIcon.
 * This component is ShrinkDiagonalIcon, with `UNSAFE_fallbackIcon` set to "MediaServicesFitToPageIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for shrinking the height and width of modals, panels, media, or objects.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ShrinkDiagonalIcon = props => /*#__PURE__*/_react.default.createElement(_shrinkDiagonal.default, Object.assign({
  name: "ShrinkDiagonalIcon",
  LEGACY_fallbackIcon: _fitToPage.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ShrinkDiagonalIcon.displayName = 'ShrinkDiagonalIconMigration';
var _default = exports.default = ShrinkDiagonalIcon;