/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::4672c42339fc6e042990bac4beef63a0>>
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
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
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
  LEGACY_fallbackIcon: _divider.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
MinusIcon.Name = 'MinusIconMigration';
var _default = exports.default = MinusIcon;