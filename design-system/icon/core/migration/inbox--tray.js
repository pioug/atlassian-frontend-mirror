/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::0bfa1b029acd867a2dba7e13279799e7>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _inbox = _interopRequireDefault(require("@atlaskit/icon/core/inbox"));
var _tray = _interopRequireDefault(require("@atlaskit/icon/glyph/tray"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for InboxIcon.
 * This component is InboxIcon, with `UNSAFE_fallbackIcon` set to "TrayIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: 'Your work' in Confluence, inbox, mail.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const InboxIcon = props => /*#__PURE__*/_react.default.createElement(_inbox.default, Object.assign({
  LEGACY_fallbackIcon: _tray.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
InboxIcon.Name = 'InboxIconMigration';
var _default = exports.default = InboxIcon;