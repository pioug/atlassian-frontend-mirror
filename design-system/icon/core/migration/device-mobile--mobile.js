"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _deviceMobile = _interopRequireDefault(require("@atlaskit/icon/core/device-mobile"));
var _mobile = _interopRequireDefault(require("@atlaskit/icon/glyph/mobile"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for DeviceMobileIcon.
 * This component is DeviceMobileIcon, with `UNSAFE_fallbackIcon` set to "MobileIcon".
 *
 * Category: Multi-purpose
 * Location: ADS
 * Usage guidance: Known uses: call, contact us.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const DeviceMobileIcon = props => /*#__PURE__*/_react.default.createElement(_deviceMobile.default, Object.assign({
  LEGACY_fallbackIcon: _mobile.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
DeviceMobileIcon.Name = 'DeviceMobileIconMigration';
var _default = exports.default = DeviceMobileIcon;