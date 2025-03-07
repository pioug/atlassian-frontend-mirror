/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::7342af43ff78fbaaff352db7bff776b1>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _contentWrapLeft = _interopRequireDefault(require("@atlaskit/icon/core/content-wrap-left"));
var _mediaWrapLeft = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/media-wrap-left"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for ContentWrapLeftIcon.
 * This component is ContentWrapLeftIcon, with `UNSAFE_fallbackIcon` set to "EditorMediaWrapLeftIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for left aligning media and content with wrapping enabled.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ContentWrapLeftIcon = props => /*#__PURE__*/_react.default.createElement(_contentWrapLeft.default, Object.assign({
  LEGACY_fallbackIcon: _mediaWrapLeft.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ContentWrapLeftIcon.Name = 'ContentWrapLeftIconMigration';
var _default = exports.default = ContentWrapLeftIcon;