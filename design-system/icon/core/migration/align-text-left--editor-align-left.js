/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::edd69f1dc202d655d5839c0a296fc693>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _alignTextLeft = _interopRequireDefault(require("@atlaskit/icon/core/align-text-left"));
var _alignLeft = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/align-left"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for AlignTextLeftIcon.
 * This component is AlignTextLeftIcon, with `UNSAFE_fallbackIcon` set to "EditorAlignLeftIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: align text left, align content left, summary.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const AlignTextLeftIcon = props => /*#__PURE__*/_react.default.createElement(_alignTextLeft.default, Object.assign({
  LEGACY_fallbackIcon: _alignLeft.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
AlignTextLeftIcon.Name = 'AlignTextLeftIconMigration';
var _default = exports.default = AlignTextLeftIcon;