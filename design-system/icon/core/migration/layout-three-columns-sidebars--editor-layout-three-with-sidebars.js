/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::2aef4f04c1f788d70b0bae68a78435e8>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _layoutThreeColumnsSidebars = _interopRequireDefault(require("@atlaskit/icon/core/layout-three-columns-sidebars"));
var _layoutThreeWithSidebars = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/layout-three-with-sidebars"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for LayoutThreeColumnsSidebarsIcon.
 * This component is LayoutThreeColumnsSidebarsIcon, with `UNSAFE_fallbackIcon` set to "EditorLayoutThreeWithSidebarsIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for 3 column layout with left and right sidebars option in Confluence Editor.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const LayoutThreeColumnsSidebarsIcon = props => /*#__PURE__*/_react.default.createElement(_layoutThreeColumnsSidebars.default, Object.assign({
  LEGACY_fallbackIcon: _layoutThreeWithSidebars.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
LayoutThreeColumnsSidebarsIcon.Name = 'LayoutThreeColumnsSidebarsIconMigration';
var _default = exports.default = LayoutThreeColumnsSidebarsIcon;