/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::468397db8b621d0b872ec4fdf86e27df>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _statusWarning = _interopRequireDefault(require("@atlaskit/icon/core/status-warning"));
var _warning = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/warning"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for StatusWarningIcon.
 * This component is StatusWarningIcon, with `UNSAFE_fallbackIcon` set to "EditorWarningIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for warning statuses.
Filled status icons provide higher visual contrast to draw attention to important information.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const StatusWarningIcon = props => /*#__PURE__*/_react.default.createElement(_statusWarning.default, Object.assign({
  LEGACY_fallbackIcon: _warning.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
StatusWarningIcon.Name = 'StatusWarningIconMigration';
var _default = exports.default = StatusWarningIcon;