"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _retry = _interopRequireDefault(require("@atlaskit/icon/core/retry"));
var _retry2 = _interopRequireDefault(require("@atlaskit/icon/glyph/retry"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for RetryIcon.
 * This component is RetryIcon, with `UNSAFE_fallbackIcon` set to "RetryIcon".
 *
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for retry.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const RetryIcon = props => /*#__PURE__*/_react.default.createElement(_retry.default, Object.assign({
  LEGACY_fallbackIcon: _retry2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
RetryIcon.Name = 'RetryIconMigration';
var _default = exports.default = RetryIcon;