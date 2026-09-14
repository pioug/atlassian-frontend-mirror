/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::3cce92d862e6831d06eeb26ee6405616>>
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
 * Icon: "Node".
 * Category: single-purpose
 * Location: @atlaskit/icon/core/node
 * Usage guidance:
 * Single purpose - Reserved for a non-expandable item in a page tree.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const NodeIcon = props => /*#__PURE__*/_react.default.createElement(_iconNew.default, Object.assign({
  name: "NodeIcon",
  dangerouslySetGlyph: `<path fill="currentcolor" d="M10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
NodeIcon.displayName = 'NodeIcon';
var _default = exports.default = NodeIcon;