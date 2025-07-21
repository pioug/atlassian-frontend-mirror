/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::d11500fc79ac0e5637954a63f0212549>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _statusSuccess = _interopRequireDefault(require("@atlaskit/icon/core/status-success"));
var _success = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/success"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for StatusSuccessIcon.
 * This component is StatusSuccessIcon, with `UNSAFE_fallbackIcon` set to "EditorSuccessIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for success statuses and messaging. Filled status icons provide higher visual contrast to draw attention to important information.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const StatusSuccessIcon = props => /*#__PURE__*/_react.default.createElement(_statusSuccess.default, Object.assign({
  LEGACY_fallbackIcon: _success.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
StatusSuccessIcon.Name = 'StatusSuccessIconMigration';
var _default = exports.default = StatusSuccessIcon;