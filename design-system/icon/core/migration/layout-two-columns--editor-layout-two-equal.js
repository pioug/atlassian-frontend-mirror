/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::4571b7e70ca52e55dc3b5128ce36d6f8>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _layoutTwoColumns = _interopRequireDefault(require("@atlaskit/icon/core/layout-two-columns"));
var _layoutTwoEqual = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/layout-two-equal"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for LayoutTwoColumnsIcon.
 * This component is LayoutTwoColumnsIcon, with `UNSAFE_fallbackIcon` set to "EditorLayoutTwoEqualIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for 2 column layout option in Confluence Editor.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const LayoutTwoColumnsIcon = props => /*#__PURE__*/_react.default.createElement(_layoutTwoColumns.default, Object.assign({
  name: "LayoutTwoColumnsIcon",
  LEGACY_fallbackIcon: _layoutTwoEqual.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
LayoutTwoColumnsIcon.displayName = 'LayoutTwoColumnsIconMigration';
var _default = exports.default = LayoutTwoColumnsIcon;