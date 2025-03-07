/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::d8e199447618ebf9961e7eca7a27c952>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _dragHandleVertical = _interopRequireDefault(require("@atlaskit/icon/core/drag-handle-vertical"));
var _dragHandler = _interopRequireDefault(require("@atlaskit/icon/glyph/drag-handler"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for DragHandleVerticalIcon.
 * This component is DragHandleVerticalIcon, with `UNSAFE_fallbackIcon` set to "DragHandlerIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for dragging elements along a vertical axis.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const DragHandleVerticalIcon = props => /*#__PURE__*/_react.default.createElement(_dragHandleVertical.default, Object.assign({
  LEGACY_fallbackIcon: _dragHandler.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
DragHandleVerticalIcon.Name = 'DragHandleVerticalIconMigration';
var _default = exports.default = DragHandleVerticalIcon;