/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::97944f0591a7fa23127cebd1d6993097>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _chevronUp = _interopRequireDefault(require("@atlaskit/icon/utility/chevron-up"));
var _chevronUpCircle = _interopRequireDefault(require("@atlaskit/icon/glyph/chevron-up-circle"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for ChevronUpIcon.
 * This component is ChevronUpIcon, with `UNSAFE_fallbackIcon` set to "ChevronUpCircleIcon".
 *
 * Category: utility
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for accordions.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ChevronUpIcon = props => /*#__PURE__*/_react.default.createElement(_chevronUp.default, Object.assign({
  LEGACY_fallbackIcon: _chevronUpCircle.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ChevronUpIcon.Name = 'ChevronUpIconMigration';
var _default = exports.default = ChevronUpIcon;