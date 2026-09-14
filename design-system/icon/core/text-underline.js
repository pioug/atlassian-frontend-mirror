/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::d8428ad3e966f216a91f320cc6db50f7>>
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
 * Icon: "TextUnderline".
 * Category: single-purpose
 * Location: @atlaskit/icon/core/text-underline
 * Usage guidance:
 * Reserved for underlined text tool
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const TextUnderlineIcon = props => /*#__PURE__*/_react.default.createElement(_iconNew.default, Object.assign({
  name: "TextUnderlineIcon",
  dangerouslySetGlyph: `<path fill="currentcolor" fill-rule="evenodd" d="M3.5 8V1H5v7a3 3 0 0 0 6 0V1h1.5v7a4.5 4.5 0 1 1-9 0M0 16v-1.5h16V16z" clip-rule="evenodd"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
TextUnderlineIcon.displayName = 'TextUnderlineIcon';
var _default = exports.default = TextUnderlineIcon;