/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::9909deb03aebbe07e5563487a0ba0457>>
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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for ContentAlignCenterIcon.
 * This component is ContentAlignCenterIcon, with `UNSAFE_fallbackIcon` set to "EditorAlignImageCenterIcon".
 *
 * Category: multi-purpose
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