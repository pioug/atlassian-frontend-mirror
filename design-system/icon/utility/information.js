/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::27668a0671d09dc2613ff96651c1fef4>>
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
 * Icon: "Information".
 * Category: utility
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for Helper Messages in Forms.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const InformationIcon = props => /*#__PURE__*/_react.default.createElement(_baseNew.default, Object.assign({
  dangerouslySetGlyph: `<path fill="currentcolor" fill-rule="evenodd" d="M12 6A6 6 0 1 1 0 6a6 6 0 0 1 12 0m-7.5-.75H6a.75.75 0 0 1 .75.75v4h-1.5V6.75H4.5zM6 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2" clip-rule="evenodd"/>`,
  type: 'utility'
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
InformationIcon.displayName = 'InformationIcon';
var _default = exports.default = InformationIcon;