/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::1f569cce0e32219880a033864a6f0dff>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _checkMark = _interopRequireDefault(require("@atlaskit/icon/utility/check-mark"));
var _check = _interopRequireDefault(require("@atlaskit/icon/glyph/check"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for CheckMarkIcon.
 * This component is CheckMarkIcon, with `UNSAFE_fallbackIcon` set to "CheckIcon".
 *
 * Category: utility
 * Location: @atlaskit/icon
 * Usage guidance: TBD
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CheckMarkIcon = props => /*#__PURE__*/_react.default.createElement(_checkMark.default, Object.assign({
  LEGACY_fallbackIcon: _check.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CheckMarkIcon.Name = 'CheckMarkIconMigration';
var _default = exports.default = CheckMarkIcon;