/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::f966e8890debb57eaf4e6f167681f98b>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _statusSuccess = _interopRequireDefault(require("@atlaskit/icon/core/status-success"));
var _checkCircle = _interopRequireDefault(require("@atlaskit/icon/glyph/check-circle"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for StatusSuccessIcon.
 * This component is StatusSuccessIcon, with `UNSAFE_fallbackIcon` set to "CheckCircleIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for success statuses and messaging. Filled status icons provide higher visual contrast to draw attention to important information.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const StatusSuccessIcon = props => /*#__PURE__*/_react.default.createElement(_statusSuccess.default, Object.assign({
  name: "StatusSuccessIcon",
  LEGACY_fallbackIcon: _checkCircle.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
StatusSuccessIcon.displayName = 'StatusSuccessIconMigration';
var _default = exports.default = StatusSuccessIcon;