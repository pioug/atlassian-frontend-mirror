/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::750ecc162e36259ef90344888c589176>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _statusInformation = _interopRequireDefault(require("@atlaskit/icon/core/status-information"));
var _info = _interopRequireDefault(require("@atlaskit/icon/glyph/info"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for StatusInformationIcon.
 * This component is StatusInformationIcon, with `UNSAFE_fallbackIcon` set to "InfoIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for information statuses and messaging. 
Filled status icons provide higher visual contrast to draw attention to important information.
For information tooltips, use the unfilled 'information circle' icon.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const StatusInformationIcon = props => /*#__PURE__*/_react.default.createElement(_statusInformation.default, Object.assign({
  name: "StatusInformationIcon",
  LEGACY_fallbackIcon: _info.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
StatusInformationIcon.displayName = 'StatusInformationIconMigration';
var _default = exports.default = StatusInformationIcon;