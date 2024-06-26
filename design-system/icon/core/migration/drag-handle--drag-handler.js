"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _dragHandle = _interopRequireDefault(require("@atlaskit/icon/core/drag-handle"));
var _dragHandler = _interopRequireDefault(require("@atlaskit/icon/glyph/drag-handler"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for DragHandleIcon.
 * This component is DragHandleIcon, with `UNSAFE_fallbackIcon` set to "DragHandlerIcon".
 *
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for draggable elements.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const DragHandleIcon = props => /*#__PURE__*/_react.default.createElement(_dragHandle.default, Object.assign({
  LEGACY_fallbackIcon: _dragHandler.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
DragHandleIcon.Name = 'DragHandleIconMigration';
var _default = exports.default = DragHandleIcon;