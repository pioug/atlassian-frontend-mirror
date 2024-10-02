/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::bf2978bc888fcedeea792246eab34f47>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _arrowDown = _interopRequireDefault(require("@atlaskit/icon/core/arrow-down"));
var _arrowDown2 = _interopRequireDefault(require("@atlaskit/icon/glyph/arrow-down"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for ArrowDownIcon.
 * This component is ArrowDownIcon, with `UNSAFE_fallbackIcon` set to "ArrowDownIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Know uses: sorting table headers or Bitbucket code difference.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ArrowDownIcon = props => /*#__PURE__*/_react.default.createElement(_arrowDown.default, Object.assign({
  LEGACY_fallbackIcon: _arrowDown2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ArrowDownIcon.Name = 'ArrowDownIconMigration';
var _default = exports.default = ArrowDownIcon;