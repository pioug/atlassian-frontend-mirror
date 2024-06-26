"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _error = _interopRequireDefault(require("@atlaskit/icon/core/error"));
var _error2 = _interopRequireDefault(require("@atlaskit/icon/glyph/error"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for ErrorIcon.
 * This component is ErrorIcon, with `UNSAFE_fallbackIcon` set to "ErrorIcon".
 *
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for when there is an error.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ErrorIcon = props => /*#__PURE__*/_react.default.createElement(_error.default, Object.assign({
  LEGACY_fallbackIcon: _error2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ErrorIcon.Name = 'ErrorIconMigration';
var _default = exports.default = ErrorIcon;