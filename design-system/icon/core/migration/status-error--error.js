/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::8687bcf05df783ceffe46d3fd0178463>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _statusError = _interopRequireDefault(require("@atlaskit/icon/core/status-error"));
var _error = _interopRequireDefault(require("@atlaskit/icon/glyph/error"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for StatusErrorIcon.
 * This component is StatusErrorIcon, with `UNSAFE_fallbackIcon` set to "ErrorIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for error statuses and messaging.
Filled status icons provide higher visual contrast to draw attention to important information.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const StatusErrorIcon = props => /*#__PURE__*/_react.default.createElement(_statusError.default, Object.assign({
  LEGACY_fallbackIcon: _error.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
StatusErrorIcon.Name = 'StatusErrorIconMigration';
var _default = exports.default = StatusErrorIcon;