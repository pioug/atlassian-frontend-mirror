/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::c13696afcc546e8bf0fe91a6c236c8d3>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _cross = _interopRequireDefault(require("@atlaskit/icon/utility/cross"));
var _close = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/close"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for CrossIcon.
 * This component is CrossIcon, with `UNSAFE_fallbackIcon` set to "EditorCloseIcon".
 *
 * Category: utility
 * Location: @atlaskit/icon
 * Usage guidance: Known uses: remove tag.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CrossIcon = props => /*#__PURE__*/_react.default.createElement(_cross.default, Object.assign({
  LEGACY_fallbackIcon: _close.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CrossIcon.Name = 'CrossIconMigration';
var _default = exports.default = CrossIcon;