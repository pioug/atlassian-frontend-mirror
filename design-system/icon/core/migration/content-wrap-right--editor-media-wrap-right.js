/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::c6611386680c1a3fd2f03c432bd9e460>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _contentWrapRight = _interopRequireDefault(require("@atlaskit/icon/core/content-wrap-right"));
var _mediaWrapRight = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/media-wrap-right"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for ContentWrapRightIcon.
 * This component is ContentWrapRightIcon, with `UNSAFE_fallbackIcon` set to "EditorMediaWrapRightIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for right aligning media and content with wrapping enabled.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ContentWrapRightIcon = props => /*#__PURE__*/_react.default.createElement(_contentWrapRight.default, Object.assign({
  name: "ContentWrapRightIcon",
  LEGACY_fallbackIcon: _mediaWrapRight.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ContentWrapRightIcon.displayName = 'ContentWrapRightIconMigration';
var _default = exports.default = ContentWrapRightIcon;