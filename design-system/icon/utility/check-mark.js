/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::a2b3d74d01725a5e998bf107ea1b09c6>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _baseNew = _interopRequireDefault(require("@atlaskit/icon/base-new"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 * Please reach out in #icon-contributions before using these in production.
 *
 * Icon: "CheckMark".
 * Category: utility
 * Location: @atlaskit/icon
 * Usage guidance: 📦 @atlaskit/icon/utility/check-mark
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CheckMarkIcon = props => /*#__PURE__*/_react.default.createElement(_baseNew.default, Object.assign({
  dangerouslySetGlyph: `<path stroke="currentcolor" stroke-linejoin="round" stroke-width="1.5" d="m1.5 6 2.75 3.5 6.25-7"/>`,
  type: 'utility'
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CheckMarkIcon.displayName = 'CheckMarkIcon';
var _default = exports.default = CheckMarkIcon;