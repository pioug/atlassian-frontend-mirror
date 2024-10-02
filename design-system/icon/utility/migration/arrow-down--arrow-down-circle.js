/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::71ca1e6e464319c5a9fc6bc5d7f85593>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _arrowDown = _interopRequireDefault(require("@atlaskit/icon/utility/arrow-down"));
var _arrowDownCircle = _interopRequireDefault(require("@atlaskit/icon/glyph/arrow-down-circle"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for ArrowDownIcon.
 * This component is ArrowDownIcon, with `UNSAFE_fallbackIcon` set to "ArrowDownCircleIcon".
 *
 * Category: utility
 * Location: @atlaskit/icon
 * Usage guidance: Know uses: sorting table headers or Bitbucket code difference.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ArrowDownIcon = props => /*#__PURE__*/_react.default.createElement(_arrowDown.default, Object.assign({
  LEGACY_fallbackIcon: _arrowDownCircle.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ArrowDownIcon.Name = 'ArrowDownIconMigration';
var _default = exports.default = ArrowDownIcon;