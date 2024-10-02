/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::f6fc0d5b2ae80c90f2b89910931eb887>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _arrowUp = _interopRequireDefault(require("@atlaskit/icon/core/arrow-up"));
var _arrowUpCircle = _interopRequireDefault(require("@atlaskit/icon/glyph/arrow-up-circle"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for ArrowUpIcon.
 * This component is ArrowUpIcon, with `UNSAFE_fallbackIcon` set to "ArrowUpCircleIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: back to top.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ArrowUpIcon = props => /*#__PURE__*/_react.default.createElement(_arrowUp.default, Object.assign({
  LEGACY_fallbackIcon: _arrowUpCircle.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ArrowUpIcon.Name = 'ArrowUpIconMigration';
var _default = exports.default = ArrowUpIcon;