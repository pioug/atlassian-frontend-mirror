/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::9825355c098f8ca42b47af25e82ef634>>
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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for SubtasksIcon.
 * This component is SubtasksIcon, with `UNSAFE_fallbackIcon` set to "SubtaskIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for subtask work type.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const SubtasksIcon = props => /*#__PURE__*/_react.default.createElement(_subtasks.default, Object.assign({
  name: "SubtasksIcon",
  LEGACY_fallbackIcon: _subtask.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
SubtasksIcon.displayName = 'SubtasksIconMigration';
var _default = exports.default = SubtasksIcon;