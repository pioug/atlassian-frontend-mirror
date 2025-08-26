/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::43e098af61abd467f677e517361d7166>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _growHorizontal = _interopRequireDefault(require("@atlaskit/icon/core/grow-horizontal"));
var _expand = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/expand"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for GrowHorizontalIcon.
 * This component is GrowHorizontalIcon, with `UNSAFE_fallbackIcon` set to "EditorExpandIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for increasing the width of an element.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const GrowHorizontalIcon = props => /*#__PURE__*/_react.default.createElement(_growHorizontal.default, Object.assign({
  name: "GrowHorizontalIcon",
  LEGACY_fallbackIcon: _expand.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
GrowHorizontalIcon.displayName = 'GrowHorizontalIconMigration';
var _default = exports.default = GrowHorizontalIcon;