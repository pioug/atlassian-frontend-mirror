/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::2e9b3aa5511613a4421823228c366b32>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _radioChecked = _interopRequireDefault(require("@atlaskit/icon/core/radio-checked"));
var _radio = _interopRequireDefault(require("@atlaskit/icon/glyph/radio"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for RadioCheckedIcon.
 * This component is RadioCheckedIcon, with `UNSAFE_fallbackIcon` set to "RadioIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for the selected state of radio controls.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const RadioCheckedIcon = props => /*#__PURE__*/_react.default.createElement(_radioChecked.default, Object.assign({
  name: "RadioCheckedIcon",
  LEGACY_fallbackIcon: _radio.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
RadioCheckedIcon.displayName = 'RadioCheckedIconMigration';
var _default = exports.default = RadioCheckedIcon;