/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::e47a8ea87927faae7faffd8febb4eb98>>
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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for OnCallIcon.
 * This component is OnCallIcon, with `UNSAFE_fallbackIcon` set to "HipchatDialOutIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for representing on-call across Atlassian products.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const OnCallIcon = props => /*#__PURE__*/_react.default.createElement(_onCall.default, Object.assign({
  LEGACY_fallbackIcon: _dialOut.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
OnCallIcon.Name = 'OnCallIconMigration';
var _default = exports.default = OnCallIcon;