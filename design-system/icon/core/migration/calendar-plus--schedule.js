/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::7f56e12a01e9ee7263ad677be6a80715>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _calendarPlus = _interopRequireDefault(require("@atlaskit/icon/core/calendar-plus"));
var _schedule = _interopRequireDefault(require("@atlaskit/icon/glyph/schedule"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for CalendarPlusIcon.
 * This component is CalendarPlusIcon, with `UNSAFE_fallbackIcon` set to "ScheduleIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Known uses: Auto-scheduling in Jira Plans. Scheduled dates.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CalendarPlusIcon = props => /*#__PURE__*/_react.default.createElement(_calendarPlus.default, Object.assign({
  LEGACY_fallbackIcon: _schedule.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CalendarPlusIcon.Name = 'CalendarPlusIconMigration';
var _default = exports.default = CalendarPlusIcon;