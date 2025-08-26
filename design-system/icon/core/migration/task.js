/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::867aac594a00c00e8dd18e33eea700ab>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _task = _interopRequireDefault(require("@atlaskit/icon/core/task"));
var _task2 = _interopRequireDefault(require("@atlaskit/icon/glyph/task"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for TaskIcon.
 * This component is TaskIcon, with `UNSAFE_fallbackIcon` set to "TaskIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for tasks in Jira.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const TaskIcon = props => /*#__PURE__*/_react.default.createElement(_task.default, Object.assign({
  name: "TaskIcon",
  LEGACY_fallbackIcon: _task2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
TaskIcon.displayName = 'TaskIconMigration';
var _default = exports.default = TaskIcon;