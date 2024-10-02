/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::b5f50c4cd55787140328acbc8b112e91>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _shrinkHorizontal = _interopRequireDefault(require("@atlaskit/icon/core/shrink-horizontal"));
var _collapse = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/collapse"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for ShrinkHorizontalIcon.
 * This component is ShrinkHorizontalIcon, with `UNSAFE_fallbackIcon` set to "EditorCollapseIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for contracting or reducing the width of an element.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ShrinkHorizontalIcon = props => /*#__PURE__*/_react.default.createElement(_shrinkHorizontal.default, Object.assign({
  LEGACY_fallbackIcon: _collapse.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ShrinkHorizontalIcon.Name = 'ShrinkHorizontalIconMigration';
var _default = exports.default = ShrinkHorizontalIcon;