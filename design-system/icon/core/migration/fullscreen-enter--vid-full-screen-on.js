"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _fullscreenEnter = _interopRequireDefault(require("@atlaskit/icon/core/fullscreen-enter"));
var _vidFullScreenOn = _interopRequireDefault(require("@atlaskit/icon/glyph/vid-full-screen-on"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for FullscreenEnterIcon.
 * This component is FullscreenEnterIcon, with `UNSAFE_fallbackIcon` set to "VidFullScreenOnIcon".
 *
 * Category: Single-purpose
 * Location: Icon contributions
 * Usage guidance: Reserved for full screen videos or objects.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const FullscreenEnterIcon = props => /*#__PURE__*/_react.default.createElement(_fullscreenEnter.default, Object.assign({
  LEGACY_fallbackIcon: _vidFullScreenOn.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
FullscreenEnterIcon.Name = 'FullscreenEnterIconMigration';
var _default = exports.default = FullscreenEnterIcon;