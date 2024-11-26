/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::bf93ff05a5c12ce008085ee1ce29a192>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _lightbulb = _interopRequireDefault(require("@atlaskit/icon/core/lightbulb"));
var _lightbulb2 = _interopRequireDefault(require("@atlaskit/icon/glyph/lightbulb"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for LightbulbIcon.
 * This component is LightbulbIcon, with `UNSAFE_fallbackIcon` set to "LightbulbIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Known uses: learnings in Atlas.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const LightbulbIcon = props => /*#__PURE__*/_react.default.createElement(_lightbulb.default, Object.assign({
  LEGACY_fallbackIcon: _lightbulb2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
LightbulbIcon.Name = 'LightbulbIconMigration';
var _default = exports.default = LightbulbIcon;