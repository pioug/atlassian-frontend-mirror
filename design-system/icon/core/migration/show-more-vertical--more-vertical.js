/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::d4e5a1a25c2a76c28b194706975186c3>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _showMoreVertical = _interopRequireDefault(require("@atlaskit/icon/core/show-more-vertical"));
var _moreVertical = _interopRequireDefault(require("@atlaskit/icon/glyph/more-vertical"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for ShowMoreVerticalIcon.
 * This component is ShowMoreVerticalIcon, with `UNSAFE_fallbackIcon` set to "MoreVerticalIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for more action menus, traditionally on mobile.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ShowMoreVerticalIcon = props => /*#__PURE__*/_react.default.createElement(_showMoreVertical.default, Object.assign({
  name: "ShowMoreVerticalIcon",
  LEGACY_fallbackIcon: _moreVertical.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ShowMoreVerticalIcon.displayName = 'ShowMoreVerticalIconMigration';
var _default = exports.default = ShowMoreVerticalIcon;