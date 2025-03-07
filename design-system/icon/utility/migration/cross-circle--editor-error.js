/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::9febab52a7c7afc207dc6d1cfa641e75>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _crossCircle = _interopRequireDefault(require("@atlaskit/icon/utility/cross-circle"));
var _error = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/error"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for CrossCircleIcon.
 * This component is CrossCircleIcon, with `UNSAFE_fallbackIcon` set to "EditorErrorIcon".
 *
 * Category: utility
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for Helper Messages in Forms.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CrossCircleIcon = props => /*#__PURE__*/_react.default.createElement(_crossCircle.default, Object.assign({
  LEGACY_fallbackIcon: _error.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CrossCircleIcon.Name = 'CrossCircleIconMigration';
var _default = exports.default = CrossCircleIcon;