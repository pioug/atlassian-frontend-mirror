/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::b8b92bb0afb812964801f580112fe83b>>
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
  name: "CalendarPlusIcon",
  LEGACY_fallbackIcon: _schedule.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CalendarPlusIcon.displayName = 'CalendarPlusIconMigration';
var _default = exports.default = CalendarPlusIcon;