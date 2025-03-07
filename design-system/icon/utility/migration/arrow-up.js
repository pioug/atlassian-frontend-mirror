/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::2a032ed88c5d0864c0eb599d8ffde445>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _arrowUp = _interopRequireDefault(require("@atlaskit/icon/utility/arrow-up"));
var _arrowUp2 = _interopRequireDefault(require("@atlaskit/icon/glyph/arrow-up"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for ArrowUpIcon.
 * This component is ArrowUpIcon, with `UNSAFE_fallbackIcon` set to "ArrowUpIcon".
 *
 * Category: utility
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