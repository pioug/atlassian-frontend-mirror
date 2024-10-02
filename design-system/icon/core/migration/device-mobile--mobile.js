/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::d31f04a0ba664a86d886d8b6fc1902e5>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _deviceMobile = _interopRequireDefault(require("@atlaskit/icon/core/device-mobile"));
var _mobile = _interopRequireDefault(require("@atlaskit/icon/glyph/mobile"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for DeviceMobileIcon.
 * This component is DeviceMobileIcon, with `UNSAFE_fallbackIcon` set to "MobileIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: call, contact us.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const DeviceMobileIcon = props => /*#__PURE__*/_react.default.createElement(_deviceMobile.default, Object.assign({
  LEGACY_fallbackIcon: _mobile.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
DeviceMobileIcon.Name = 'DeviceMobileIconMigration';
var _default = exports.default = DeviceMobileIcon;