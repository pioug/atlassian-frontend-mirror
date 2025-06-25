/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::5bfd3fa037eb79e2f4e6e4739f9b346e>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _cross = _interopRequireDefault(require("@atlaskit/icon/utility/cross"));
var _cross2 = _interopRequireDefault(require("@atlaskit/icon/glyph/cross"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for CrossIcon.
 * This component is CrossIcon, with `UNSAFE_fallbackIcon` set to "CrossIcon".
 *
 * Category: utility
 * Location: @atlaskit/icon
 * Usage guidance: Known uses: remove tag.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CrossIcon = props => /*#__PURE__*/_react.default.createElement(_cross.default, Object.assign({
  LEGACY_fallbackIcon: _cross2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CrossIcon.Name = 'CrossIconMigration';
var _default = exports.default = CrossIcon;