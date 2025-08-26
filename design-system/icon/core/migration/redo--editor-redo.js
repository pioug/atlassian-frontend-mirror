/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::f526fd53f8ede10c6fbc641134c9d09c>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _redo = _interopRequireDefault(require("@atlaskit/icon/core/redo"));
var _redo2 = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/redo"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for RedoIcon.
 * This component is RedoIcon, with `UNSAFE_fallbackIcon` set to "EditorRedoIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for redo in Editor.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const RedoIcon = props => /*#__PURE__*/_react.default.createElement(_redo.default, Object.assign({
  name: "RedoIcon",
  LEGACY_fallbackIcon: _redo2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
RedoIcon.displayName = 'RedoIconMigration';
var _default = exports.default = RedoIcon;