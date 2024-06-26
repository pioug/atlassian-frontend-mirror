"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _undo = _interopRequireDefault(require("@atlaskit/icon/core/undo"));
var _undo2 = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/undo"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for UndoIcon.
 * This component is UndoIcon, with `UNSAFE_fallbackIcon` set to "EditorUndoIcon".
 *
 * Category: Single-purpose
 * Location: Icon contributions
 * Usage guidance: Reserved for undo in Editor.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const UndoIcon = props => /*#__PURE__*/_react.default.createElement(_undo.default, Object.assign({
  LEGACY_fallbackIcon: _undo2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
UndoIcon.Name = 'UndoIconMigration';
var _default = exports.default = UndoIcon;