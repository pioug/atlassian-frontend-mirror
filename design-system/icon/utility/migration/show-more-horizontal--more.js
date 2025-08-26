/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::05931c7de6eea72a1c90bf5507b6c500>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _showMoreHorizontal = _interopRequireDefault(require("@atlaskit/icon/utility/show-more-horizontal"));
var _more = _interopRequireDefault(require("@atlaskit/icon/glyph/more"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for ShowMoreHorizontalIcon.
 * This component is ShowMoreHorizontalIcon, with `UNSAFE_fallbackIcon` set to "MoreIcon".
 *
 * Category: utility
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for secondary/tertiary more action menus.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ShowMoreHorizontalIcon = props => /*#__PURE__*/_react.default.createElement(_showMoreHorizontal.default, Object.assign({
  name: "ShowMoreHorizontalIcon",
  LEGACY_fallbackIcon: _more.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ShowMoreHorizontalIcon.displayName = 'ShowMoreHorizontalIconMigration';
var _default = exports.default = ShowMoreHorizontalIcon;