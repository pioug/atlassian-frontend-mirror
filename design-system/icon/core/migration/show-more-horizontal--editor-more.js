/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::aad5194e08f67bfe24a1828a13f5785c>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _showMoreHorizontal = _interopRequireDefault(require("@atlaskit/icon/core/show-more-horizontal"));
var _more = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/more"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for ShowMoreHorizontalIcon.
 * This component is ShowMoreHorizontalIcon, with `UNSAFE_fallbackIcon` set to "EditorMoreIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for more action menus.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ShowMoreHorizontalIcon = props => /*#__PURE__*/_react.default.createElement(_showMoreHorizontal.default, Object.assign({
  LEGACY_fallbackIcon: _more.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ShowMoreHorizontalIcon.Name = 'ShowMoreHorizontalIconMigration';
var _default = exports.default = ShowMoreHorizontalIcon;