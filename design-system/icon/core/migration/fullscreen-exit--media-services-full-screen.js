/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::4dd6eda982765983f138f6428de8fd81>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _fullscreenExit = _interopRequireDefault(require("@atlaskit/icon/core/fullscreen-exit"));
var _fullScreen = _interopRequireDefault(require("@atlaskit/icon/glyph/media-services/full-screen"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for FullscreenExitIcon.
 * This component is FullscreenExitIcon, with `UNSAFE_fallbackIcon` set to "MediaServicesFullScreenIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for return screen videos or objects.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const FullscreenExitIcon = props => /*#__PURE__*/_react.default.createElement(_fullscreenExit.default, Object.assign({
  LEGACY_fallbackIcon: _fullScreen.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
FullscreenExitIcon.Name = 'FullscreenExitIconMigration';
var _default = exports.default = FullscreenExitIcon;