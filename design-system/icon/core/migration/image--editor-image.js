"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _image = _interopRequireDefault(require("@atlaskit/icon/core/image"));
var _image2 = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/image"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for ImageIcon.
 * This component is ImageIcon, with `UNSAFE_fallbackIcon` set to "EditorImageIcon".
 *
 * Category: Multi-purpose
 * Location: ADS
 * Usage guidance: Known uses: images, image upload.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ImageIcon = props => /*#__PURE__*/_react.default.createElement(_image.default, Object.assign({
  LEGACY_fallbackIcon: _image2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ImageIcon.Name = 'ImageIconMigration';
var _default = exports.default = ImageIcon;