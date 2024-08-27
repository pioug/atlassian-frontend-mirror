/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::6d38a9f52bfdeb0ca68edfb95af6002f>>
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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for LayoutTwoColumnsSidebarRightIcon.
 * This component is LayoutTwoColumnsSidebarRightIcon, with `UNSAFE_fallbackIcon` set to "EditorLayoutTwoRightSidebarIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for 2 column layout with right sidebar option in Confluence Editor.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const LayoutTwoColumnsSidebarRightIcon = props => /*#__PURE__*/_react.default.createElement(_layoutTwoColumnsSidebarRight.default, Object.assign({
  LEGACY_fallbackIcon: _layoutTwoRightSidebar.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
LayoutTwoColumnsSidebarRightIcon.Name = 'LayoutTwoColumnsSidebarRightIconMigration';
var _default = exports.default = LayoutTwoColumnsSidebarRightIcon;