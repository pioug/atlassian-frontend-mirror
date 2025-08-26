/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::8f3aefae583a022abe386e582aacff41>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _lightbulb = _interopRequireDefault(require("@atlaskit/icon/core/lightbulb"));
var _hint = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/hint"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for LightbulbIcon.
 * This component is LightbulbIcon, with `UNSAFE_fallbackIcon` set to "EditorHintIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Known uses: learnings in Atlas.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const LightbulbIcon = props => /*#__PURE__*/_react.default.createElement(_lightbulb.default, Object.assign({
  name: "LightbulbIcon",
  LEGACY_fallbackIcon: _hint.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
LightbulbIcon.displayName = 'LightbulbIconMigration';
var _default = exports.default = LightbulbIcon;