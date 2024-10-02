/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::3e439b002f43a5f4e3cda4db0d114175>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _sidebarRight = _interopRequireDefault(require("@atlaskit/icon/core/sidebar-right"));
var _detailView = _interopRequireDefault(require("@atlaskit/icon/glyph/detail-view"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for SidebarRightIcon.
 * This component is SidebarRightIcon, with `UNSAFE_fallbackIcon` set to "DetailViewIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for opening a sidebar to the right of the viewport edge.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const SidebarRightIcon = props => /*#__PURE__*/_react.default.createElement(_sidebarRight.default, Object.assign({
  LEGACY_fallbackIcon: _detailView.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
SidebarRightIcon.Name = 'SidebarRightIconMigration';
var _default = exports.default = SidebarRightIcon;