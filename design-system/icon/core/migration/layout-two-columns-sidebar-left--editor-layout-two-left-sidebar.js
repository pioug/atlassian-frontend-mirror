/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::e8415696cbc2266afa6adea59e7b1e67>>
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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for LayoutTwoColumnsSidebarLeftIcon.
 * This component is LayoutTwoColumnsSidebarLeftIcon, with `UNSAFE_fallbackIcon` set to "EditorLayoutTwoLeftSidebarIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for 2 column layout with left sidebar option in Confluence Editor.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const LayoutTwoColumnsSidebarLeftIcon = props => /*#__PURE__*/_react.default.createElement(_layoutTwoColumnsSidebarLeft.default, Object.assign({
  name: "LayoutTwoColumnsSidebarLeftIcon",
  LEGACY_fallbackIcon: _layoutTwoLeftSidebar.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
LayoutTwoColumnsSidebarLeftIcon.displayName = 'LayoutTwoColumnsSidebarLeftIconMigration';
var _default = exports.default = LayoutTwoColumnsSidebarLeftIcon;