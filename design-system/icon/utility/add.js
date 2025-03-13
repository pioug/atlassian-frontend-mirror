/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::73693506539a99d0ae3d26d395e92ac2>>
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
 * Icon: "Add".
 * Category: utility
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for creating and adding an object as a secondary/tertiary action in a menu item.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const AddIcon = props => /*#__PURE__*/_react.default.createElement(_baseNew.default, Object.assign({
  dangerouslySetGlyph: `<path fill="currentcolor" fill-rule="evenodd" d="M5.25 6.75V11h1.5V6.75H11v-1.5H6.75V1h-1.5v4.25H1v1.5z" clip-rule="evenodd"/>`,
  type: 'utility'
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
AddIcon.displayName = 'AddIcon';
var _default = exports.default = AddIcon;