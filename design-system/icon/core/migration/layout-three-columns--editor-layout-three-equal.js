/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::0169ce61ed5513ac59fc09e877e7d5d2>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _layoutThreeColumns = _interopRequireDefault(require("@atlaskit/icon/core/layout-three-columns"));
var _layoutThreeEqual = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/layout-three-equal"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for LayoutThreeColumnsIcon.
 * This component is LayoutThreeColumnsIcon, with `UNSAFE_fallbackIcon` set to "EditorLayoutThreeEqualIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for 3 column layout option in Confluence Editor.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const LayoutThreeColumnsIcon = props => /*#__PURE__*/_react.default.createElement(_layoutThreeColumns.default, Object.assign({
  name: "LayoutThreeColumnsIcon",
  LEGACY_fallbackIcon: _layoutThreeEqual.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
LayoutThreeColumnsIcon.displayName = 'LayoutThreeColumnsIconMigration';
var _default = exports.default = LayoutThreeColumnsIcon;