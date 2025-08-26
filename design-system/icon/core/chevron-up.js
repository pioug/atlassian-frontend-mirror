/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::b6f832dcdc2d7a1f91afd5e9b90e10b9>>
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
 * Icon: "ChevronUp".
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Do not use 16px chevrons within buttons, icon buttons, or dropdowns to maintain visual cohesion with ADS which uses 12px chevrons.
Known uses: Close dropdown menu
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ChevronUpIcon = props => /*#__PURE__*/_react.default.createElement(_baseNew.default, Object.assign({
  name: "ChevronUpIcon",
  dangerouslySetGlyph: `<path fill="currentcolor" d="m14.53 9.97-6-6a.75.75 0 0 0-1.004-.052l-.056.052-6 6 1.06 1.06L8 5.56l5.47 5.47z"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ChevronUpIcon.displayName = 'ChevronUpIcon';
var _default = exports.default = ChevronUpIcon;