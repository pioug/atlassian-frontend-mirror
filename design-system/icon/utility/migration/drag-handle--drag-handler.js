/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::1889360ea50129d9de12bad0626d7284>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _dragHandle = _interopRequireDefault(require("@atlaskit/icon/utility/drag-handle"));
var _dragHandler = _interopRequireDefault(require("@atlaskit/icon/glyph/drag-handler"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for DragHandleIcon.
 * This component is DragHandleIcon, with `UNSAFE_fallbackIcon` set to "DragHandlerIcon".
 *
 * Category: utility
 * Location: @atlaskit/icon
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