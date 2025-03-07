/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::7e6aedff4d53728f0bfb5b38b4570ce7>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _contentAlignCenter = _interopRequireDefault(require("@atlaskit/icon/core/content-align-center"));
var _alignImageCenter = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/align-image-center"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for ContentAlignCenterIcon.
 * This component is ContentAlignCenterIcon, with `UNSAFE_fallbackIcon` set to "EditorAlignImageCenterIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for center aligning media and content.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ContentAlignCenterIcon = props => /*#__PURE__*/_react.default.createElement(_contentAlignCenter.default, Object.assign({
  LEGACY_fallbackIcon: _alignImageCenter.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ContentAlignCenterIcon.Name = 'ContentAlignCenterIconMigration';
var _default = exports.default = ContentAlignCenterIcon;