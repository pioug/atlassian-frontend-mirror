/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::e9b535099e671709a722ca07e73b3a65>>
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
  name: "ChevronUpIcon",
  LEGACY_fallbackIcon: _chevronUpCircle.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ChevronUpIcon.displayName = 'ChevronUpIconMigration';
var _default = exports.default = ChevronUpIcon;