/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::180cb56e50ff6e521cbfbdf2ce34198a>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _notification = _interopRequireDefault(require("@atlaskit/icon/core/notification"));
var _notificationDirect = _interopRequireDefault(require("@atlaskit/icon/glyph/notification-direct"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for NotificationIcon.
 * This component is NotificationIcon, with `UNSAFE_fallbackIcon` set to "NotificationDirectIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for notifications within global product navigation and within product screens.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const NotificationIcon = props => /*#__PURE__*/_react.default.createElement(_notification.default, Object.assign({
  LEGACY_fallbackIcon: _notificationDirect.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
NotificationIcon.Name = 'NotificationIconMigration';
var _default = exports.default = NotificationIcon;