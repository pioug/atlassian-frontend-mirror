/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::5232347c6d8486cba9408a3db02cd18f>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _onCall = _interopRequireDefault(require("@atlaskit/icon/core/on-call"));
var _dialOut = _interopRequireDefault(require("@atlaskit/icon/glyph/hipchat/dial-out"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for OnCallIcon.
 * This component is OnCallIcon, with `UNSAFE_fallbackIcon` set to "HipchatDialOutIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for representing on-call across Atlassian apps.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const OnCallIcon = props => /*#__PURE__*/_react.default.createElement(_onCall.default, Object.assign({
  name: "OnCallIcon",
  LEGACY_fallbackIcon: _dialOut.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
OnCallIcon.displayName = 'OnCallIconMigration';
var _default = exports.default = OnCallIcon;