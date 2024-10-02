/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::c58979184425708e08a8d52f05050300>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _maximize = _interopRequireDefault(require("@atlaskit/icon/core/maximize"));
var _imageResize = _interopRequireDefault(require("@atlaskit/icon/glyph/image-resize"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for MaximizeIcon.
 * This component is MaximizeIcon, with `UNSAFE_fallbackIcon` set to "ImageResizeIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for resizing screens, panels, modals, or media to its maximum size.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const MaximizeIcon = props => /*#__PURE__*/_react.default.createElement(_maximize.default, Object.assign({
  LEGACY_fallbackIcon: _imageResize.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
MaximizeIcon.Name = 'MaximizeIconMigration';
var _default = exports.default = MaximizeIcon;