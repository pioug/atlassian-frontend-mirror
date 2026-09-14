/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::07ce97dc138cd4f55e8a1bb0a6f266b9>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _iconNew = _interopRequireDefault(require("@atlaskit/icon/components/icon-new"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Icon: "Add".
 * Category: single-purpose
 * Location: @atlaskit/icon/core/add
 * Usage guidance:
 * Single purpose - Reserved for creating and adding an object.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const AddIcon = props => /*#__PURE__*/_react.default.createElement(_iconNew.default, Object.assign({
  name: "AddIcon",
  dangerouslySetGlyph: `<path fill="currentcolor" d="M8.75 1.5v5.75h5.75v1.5H8.75v5.75h-1.5V8.75H1.5v-1.5h5.75V1.5z"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
AddIcon.displayName = 'AddIcon';
var _default = exports.default = AddIcon;