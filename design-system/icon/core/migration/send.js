/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::db57c0beca179f6e569d7e61d992b9a4>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _send = _interopRequireDefault(require("@atlaskit/icon/core/send"));
var _send2 = _interopRequireDefault(require("@atlaskit/icon/glyph/send"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for SendIcon.
 * This component is SendIcon, with `UNSAFE_fallbackIcon` set to "SendIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for sending messages in Rovo Chat.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const SendIcon = props => /*#__PURE__*/_react.default.createElement(_send.default, Object.assign({
  LEGACY_fallbackIcon: _send2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
SendIcon.Name = 'SendIconMigration';
var _default = exports.default = SendIcon;