/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::7f1a6a2b97860f6aabf49de3b70e9c8a>>
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
 * Icon: "Node".
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for a non-expandable item in a page tree.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const NodeIcon = props => /*#__PURE__*/_react.default.createElement(_baseNew.default, Object.assign({
  dangerouslySetGlyph: `<circle cx="8" cy="8" r="2" fill="currentcolor"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
NodeIcon.displayName = 'NodeIcon';
var _default = exports.default = NodeIcon;