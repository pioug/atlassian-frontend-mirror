"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _inbox = _interopRequireDefault(require("@atlaskit/icon/core/inbox"));
var _tray = _interopRequireDefault(require("@atlaskit/icon/glyph/tray"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for InboxIcon.
 * This component is InboxIcon, with `UNSAFE_fallbackIcon` set to "TrayIcon".
 *
 * Category: Multi-purpose
 * Location: Icon contributions
 * Usage guidance: Known uses: 'Your work' in Confluence, inbox, mail.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const InboxIcon = props => /*#__PURE__*/_react.default.createElement(_inbox.default, Object.assign({
  LEGACY_fallbackIcon: _tray.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
InboxIcon.Name = 'InboxIconMigration';
var _default = exports.default = InboxIcon;