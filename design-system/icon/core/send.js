/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::50f79fee3edc3bc08584e1e0f25f62c0>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _UNSAFE_baseNew = _interopRequireDefault(require("@atlaskit/icon/UNSAFE_base-new"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 * Please reach out in #icon-contributions before using these in production.
 *
 * Icon: "Send".
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for sending messages in Rovo Chat.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const SendIcon = props => /*#__PURE__*/_react.default.createElement(_UNSAFE_baseNew.default, Object.assign({
  dangerouslySetGlyph: `<path stroke="currentcolor" stroke-linejoin="round" stroke-width="1.5" d="m14.25 1.75-13.5 5 5.5 3m8-8-5 13.5-3-5.5m8-8-8 8"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
SendIcon.displayName = 'SendIcon';
var _default = exports.default = SendIcon;