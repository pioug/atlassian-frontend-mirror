/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::1003fac3ee17e1778798f4207dec4f90>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _subtasks = _interopRequireDefault(require("@atlaskit/icon/core/subtasks"));
var _subtask = _interopRequireDefault(require("@atlaskit/icon/glyph/subtask"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for SubtasksIcon.
 * This component is SubtasksIcon, with `UNSAFE_fallbackIcon` set to "SubtaskIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for subtasks in Jira.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const SubtasksIcon = props => /*#__PURE__*/_react.default.createElement(_subtasks.default, Object.assign({
  LEGACY_fallbackIcon: _subtask.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
SubtasksIcon.Name = 'SubtasksIconMigration';
var _default = exports.default = SubtasksIcon;