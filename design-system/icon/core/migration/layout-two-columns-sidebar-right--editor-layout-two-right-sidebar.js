/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::33ad64019fdd6e67f98b45b4c1bb4baf>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _layoutTwoColumnsSidebarRight = _interopRequireDefault(require("@atlaskit/icon/core/layout-two-columns-sidebar-right"));
var _layoutTwoRightSidebar = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/layout-two-right-sidebar"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for LayoutTwoColumnsSidebarRightIcon.
 * This component is LayoutTwoColumnsSidebarRightIcon, with `UNSAFE_fallbackIcon` set to "EditorLayoutTwoRightSidebarIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for 2 column layout with right sidebar option in Confluence Editor.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const LayoutTwoColumnsSidebarRightIcon = props => /*#__PURE__*/_react.default.createElement(_layoutTwoColumnsSidebarRight.default, Object.assign({
  name: "LayoutTwoColumnsSidebarRightIcon",
  LEGACY_fallbackIcon: _layoutTwoRightSidebar.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
LayoutTwoColumnsSidebarRightIcon.displayName = 'LayoutTwoColumnsSidebarRightIconMigration';
var _default = exports.default = LayoutTwoColumnsSidebarRightIcon;