/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::c05e9f43a0e08495cc4cee314cbc7935>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _arrowUp = _interopRequireDefault(require("@atlaskit/icon/core/arrow-up"));
var _arrowUp2 = _interopRequireDefault(require("@atlaskit/icon/glyph/arrow-up"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for ArrowUpIcon.
 * This component is ArrowUpIcon, with `UNSAFE_fallbackIcon` set to "ArrowUpIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Known uses: back to top.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ArrowUpIcon = props => /*#__PURE__*/_react.default.createElement(_arrowUp.default, Object.assign({
  LEGACY_fallbackIcon: _arrowUp2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ArrowUpIcon.Name = 'ArrowUpIconMigration';
var _default = exports.default = ArrowUpIcon;