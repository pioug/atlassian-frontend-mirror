/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::d49e685910265085dfeb33d7263fe1c8>>
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
  name: "SendIcon",
  LEGACY_fallbackIcon: _send2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
SendIcon.displayName = 'SendIconMigration';
var _default = exports.default = SendIcon;