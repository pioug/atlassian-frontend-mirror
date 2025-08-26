/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::55a7cee1fcdbb2cf43e6987b2a1fdb16>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _minus = _interopRequireDefault(require("@atlaskit/icon/core/minus"));
var _divider = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/divider"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for MinusIcon.
 * This component is MinusIcon, with `UNSAFE_fallbackIcon` set to "EditorDividerIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: horizontal rule in Editor.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const MinusIcon = props => /*#__PURE__*/_react.default.createElement(_minus.default, Object.assign({
  name: "MinusIcon",
  LEGACY_fallbackIcon: _divider.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
MinusIcon.displayName = 'MinusIconMigration';
var _default = exports.default = MinusIcon;