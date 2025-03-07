/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::6523555332355b1d4aa6bddc8955e159>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _retry = _interopRequireDefault(require("@atlaskit/icon/core/retry"));
var _retry2 = _interopRequireDefault(require("@atlaskit/icon/glyph/retry"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for RetryIcon.
 * This component is RetryIcon, with `UNSAFE_fallbackIcon` set to "RetryIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for retry.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const RetryIcon = props => /*#__PURE__*/_react.default.createElement(_retry.default, Object.assign({
  LEGACY_fallbackIcon: _retry2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
RetryIcon.Name = 'RetryIconMigration';
var _default = exports.default = RetryIcon;