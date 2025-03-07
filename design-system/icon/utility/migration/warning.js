/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::25255b73c374f1a1c424eeee2ba346f9>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _warning = _interopRequireDefault(require("@atlaskit/icon/utility/warning"));
var _warning2 = _interopRequireDefault(require("@atlaskit/icon/glyph/warning"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for WarningIcon.
 * This component is WarningIcon, with `UNSAFE_fallbackIcon` set to "WarningIcon".
 *
 * Category: utility
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for Helper Messages in Forms.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const WarningIcon = props => /*#__PURE__*/_react.default.createElement(_warning.default, Object.assign({
  LEGACY_fallbackIcon: _warning2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
WarningIcon.Name = 'WarningIconMigration';
var _default = exports.default = WarningIcon;