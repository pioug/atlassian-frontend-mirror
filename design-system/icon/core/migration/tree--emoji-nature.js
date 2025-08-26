/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::0b5790bb2a7acc1705cce840496635f1>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _tree = _interopRequireDefault(require("@atlaskit/icon/core/tree"));
var _nature = _interopRequireDefault(require("@atlaskit/icon/glyph/emoji/nature"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for TreeIcon.
 * This component is TreeIcon, with `UNSAFE_fallbackIcon` set to "EmojiNatureIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known usages: Nature emoji category.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const TreeIcon = props => /*#__PURE__*/_react.default.createElement(_tree.default, Object.assign({
  name: "TreeIcon",
  LEGACY_fallbackIcon: _nature.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
TreeIcon.displayName = 'TreeIconMigration';
var _default = exports.default = TreeIcon;