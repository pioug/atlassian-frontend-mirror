/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::bbe28a01095e2a3431ba1549e57b0fd6>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _layoutTwoColumnsSidebarLeft = _interopRequireDefault(require("@atlaskit/icon/core/layout-two-columns-sidebar-left"));
var _layoutTwoLeftSidebar = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/layout-two-left-sidebar"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for LayoutTwoColumnsSidebarLeftIcon.
 * This component is LayoutTwoColumnsSidebarLeftIcon, with `UNSAFE_fallbackIcon` set to "EditorLayoutTwoLeftSidebarIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for 2 column layout with left sidebar option in Confluence Editor.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const LayoutTwoColumnsSidebarLeftIcon = props => /*#__PURE__*/_react.default.createElement(_layoutTwoColumnsSidebarLeft.default, Object.assign({
  LEGACY_fallbackIcon: _layoutTwoLeftSidebar.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
LayoutTwoColumnsSidebarLeftIcon.Name = 'LayoutTwoColumnsSidebarLeftIconMigration';
var _default = exports.default = LayoutTwoColumnsSidebarLeftIcon;