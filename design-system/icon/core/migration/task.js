"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _task = _interopRequireDefault(require("@atlaskit/icon/core/task"));
var _task2 = _interopRequireDefault(require("@atlaskit/icon/glyph/task"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for TaskIcon.
 * This component is TaskIcon, with `UNSAFE_fallbackIcon` set to "TaskIcon".
 *
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for tasks in Jira.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const TaskIcon = props => /*#__PURE__*/_react.default.createElement(_task.default, Object.assign({
  LEGACY_fallbackIcon: _task2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
TaskIcon.Name = 'TaskIconMigration';
var _default = exports.default = TaskIcon;