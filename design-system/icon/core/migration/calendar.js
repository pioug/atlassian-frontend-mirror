/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::9571ec76557171a7f54748c218c48225>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _calendar = _interopRequireDefault(require("@atlaskit/icon/core/calendar"));
var _calendar2 = _interopRequireDefault(require("@atlaskit/icon/glyph/calendar"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for CalendarIcon.
 * This component is CalendarIcon, with `UNSAFE_fallbackIcon` set to "CalendarIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: date metadata, date input field, calendar view, jira status.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CalendarIcon = props => /*#__PURE__*/_react.default.createElement(_calendar.default, Object.assign({
  LEGACY_fallbackIcon: _calendar2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CalendarIcon.Name = 'CalendarIconMigration';
var _default = exports.default = CalendarIcon;