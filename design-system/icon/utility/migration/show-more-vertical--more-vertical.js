/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::1826acca0039ac0e69702046af4ba27b>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _showMoreVertical = _interopRequireDefault(require("@atlaskit/icon/utility/show-more-vertical"));
var _moreVertical = _interopRequireDefault(require("@atlaskit/icon/glyph/more-vertical"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for ShowMoreVerticalIcon.
 * This component is ShowMoreVerticalIcon, with `UNSAFE_fallbackIcon` set to "MoreVerticalIcon".
 *
 * Category: utility
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for secondary/tertiary action menus, traditionally on mobile.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ShowMoreVerticalIcon = props => /*#__PURE__*/_react.default.createElement(_showMoreVertical.default, Object.assign({
  LEGACY_fallbackIcon: _moreVertical.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ShowMoreVerticalIcon.Name = 'ShowMoreVerticalIconMigration';
var _default = exports.default = ShowMoreVerticalIcon;