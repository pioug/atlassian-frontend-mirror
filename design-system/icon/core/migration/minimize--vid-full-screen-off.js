"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _minimize = _interopRequireDefault(require("@atlaskit/icon/core/minimize"));
var _vidFullScreenOff = _interopRequireDefault(require("@atlaskit/icon/glyph/vid-full-screen-off"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for MinimizeIcon.
 * This component is MinimizeIcon, with `UNSAFE_fallbackIcon` set to "VidFullScreenOffIcon".
 *
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Known uses: minimize modal window, minimize panel, minimize video screen.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const MinimizeIcon = props => /*#__PURE__*/_react.default.createElement(_minimize.default, Object.assign({
  LEGACY_fallbackIcon: _vidFullScreenOff.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
MinimizeIcon.Name = 'MinimizeIconMigration';
var _default = exports.default = MinimizeIcon;