"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _UNSAFE_baseNew = _interopRequireDefault(require("@atlaskit/icon/UNSAFE_base-new"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Icon: "Notification".
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for notifications within global product navigation and within product screens.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const NotificationIcon = props => /*#__PURE__*/_react.default.createElement(_UNSAFE_baseNew.default, Object.assign({
  dangerouslySetGlyph: `<path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="m3.675 9.106-2.23 3.159a.625.625 0 0 0 .511.985h12.088a.625.625 0 0 0 .51-.985l-2.229-3.159a.4.4 0 0 1-.075-.236V5a4.25 4.25 0 0 0-8.5 0v3.87a.4.4 0 0 1-.075.236Z"/><path fill="currentColor" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="M10 13.25H6a2 2 0 1 0 4 0Z"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
NotificationIcon.displayName = 'NotificationIcon';
var _default = exports.default = NotificationIcon;