/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::8bde4fe2106ce234325e692c325f0f58>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _image = _interopRequireDefault(require("@atlaskit/icon/core/image"));
var _scaleLarge = _interopRequireDefault(require("@atlaskit/icon/glyph/media-services/scale-large"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for ImageIcon.
 * This component is ImageIcon, with `UNSAFE_fallbackIcon` set to "MediaServicesScaleLargeIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Known uses: images, image upload.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ImageIcon = props => /*#__PURE__*/_react.default.createElement(_image.default, Object.assign({
  LEGACY_fallbackIcon: _scaleLarge.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ImageIcon.Name = 'ImageIconMigration';
var _default = exports.default = ImageIcon;