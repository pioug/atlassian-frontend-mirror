/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::1668aeb52b83d3feb63d8a5085957ee1>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _alignImageCenter = _interopRequireDefault(require("@atlaskit/icon/core/align-image-center"));
var _alignImageCenter2 = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/align-image-center"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for AlignImageCenterIcon.
 * This component is AlignImageCenterIcon, with `UNSAFE_fallbackIcon` set to "EditorAlignImageCenterIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for center aligning media and content.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const AlignImageCenterIcon = props => /*#__PURE__*/_react.default.createElement(_alignImageCenter.default, Object.assign({
  LEGACY_fallbackIcon: _alignImageCenter2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
AlignImageCenterIcon.Name = 'AlignImageCenterIconMigration';
var _default = exports.default = AlignImageCenterIcon;