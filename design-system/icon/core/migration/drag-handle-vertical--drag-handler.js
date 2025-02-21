/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::00cf753aab05b73546ecd78f6bc8ff56>>
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
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for DragHandleVerticalIcon.
 * This component is DragHandleVerticalIcon, with `UNSAFE_fallbackIcon` set to "DragHandlerIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for draggable elements, like rows.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const DragHandleVerticalIcon = props => /*#__PURE__*/_react.default.createElement(_dragHandleVertical.default, Object.assign({
  LEGACY_fallbackIcon: _dragHandler.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
DragHandleVerticalIcon.Name = 'DragHandleVerticalIconMigration';
var _default = exports.default = DragHandleVerticalIcon;