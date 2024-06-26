"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _expand = _interopRequireDefault(require("@atlaskit/icon/core/expand"));
var _imageResize = _interopRequireDefault(require("@atlaskit/icon/glyph/image-resize"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for ExpandIcon.
 * This component is ExpandIcon, with `UNSAFE_fallbackIcon` set to "ImageResizeIcon".
 *
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for expanding a object or panel.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ExpandIcon = props => /*#__PURE__*/_react.default.createElement(_expand.default, Object.assign({
  LEGACY_fallbackIcon: _imageResize.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ExpandIcon.Name = 'ExpandIconMigration';
var _default = exports.default = ExpandIcon;