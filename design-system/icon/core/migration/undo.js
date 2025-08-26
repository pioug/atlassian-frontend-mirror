/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::79e640b6af6ce75d2b01f4d5ff86aba2>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _undo = _interopRequireDefault(require("@atlaskit/icon/core/undo"));
var _undo2 = _interopRequireDefault(require("@atlaskit/icon/glyph/undo"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for UndoIcon.
 * This component is UndoIcon, with `UNSAFE_fallbackIcon` set to "UndoIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for undo in Editor.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const UndoIcon = props => /*#__PURE__*/_react.default.createElement(_undo.default, Object.assign({
  name: "UndoIcon",
  LEGACY_fallbackIcon: _undo2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
UndoIcon.displayName = 'UndoIconMigration';
var _default = exports.default = UndoIcon;