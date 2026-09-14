/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::8b7b5313441e64074b34abd119ca75dd>>
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
 * Icon: "Minus".
 * Category: multi-purpose
 * Location: @atlaskit/icon/core/minus
 * Usage guidance:
 * Multi purpose - Known uses: horizontal rule in Editor.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const MinusIcon = props => /*#__PURE__*/_react.default.createElement(_iconNew.default, Object.assign({
  name: "MinusIcon",
  dangerouslySetGlyph: `<path fill="currentcolor" fill-rule="evenodd" d="M15 8.75H1v-1.5h14z" clip-rule="evenodd"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
MinusIcon.displayName = 'MinusIcon';
var _default = exports.default = MinusIcon;