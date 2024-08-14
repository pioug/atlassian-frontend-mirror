/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::583f872b07029bb990fb5d32bf513723>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _calendar = _interopRequireDefault(require("@atlaskit/icon/core/calendar"));
var _calendarFilled = _interopRequireDefault(require("@atlaskit/icon/glyph/calendar-filled"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for CalendarIcon.
 * This component is CalendarIcon, with `UNSAFE_fallbackIcon` set to "CalendarFilledIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Known uses: date metadata, date input field, calendar view.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CalendarIcon = props => /*#__PURE__*/_react.default.createElement(_calendar.default, Object.assign({
  LEGACY_fallbackIcon: _calendarFilled.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CalendarIcon.Name = 'CalendarIconMigration';
var _default = exports.default = CalendarIcon;