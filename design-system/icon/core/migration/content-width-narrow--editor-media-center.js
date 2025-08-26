/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::d24183ce61826871a860f2af49e7f998>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _contentWidthNarrow = _interopRequireDefault(require("@atlaskit/icon/core/content-width-narrow"));
var _mediaCenter = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/media-center"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for ContentWidthNarrowIcon.
 * This component is ContentWidthNarrowIcon, with `UNSAFE_fallbackIcon` set to "EditorMediaCenterIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for setting media and content to a narrow width.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ContentWidthNarrowIcon = props => /*#__PURE__*/_react.default.createElement(_contentWidthNarrow.default, Object.assign({
  name: "ContentWidthNarrowIcon",
  LEGACY_fallbackIcon: _mediaCenter.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ContentWidthNarrowIcon.displayName = 'ContentWidthNarrowIconMigration';
var _default = exports.default = ContentWidthNarrowIcon;