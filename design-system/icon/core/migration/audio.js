/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::bd69b7cfada02387d44f07e86e65cf52>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _audio = _interopRequireDefault(require("@atlaskit/icon/core/audio"));
var _audio2 = _interopRequireDefault(require("@atlaskit/icon/glyph/audio"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for AudioIcon.
 * This component is AudioIcon, with `UNSAFE_fallbackIcon` set to "AudioIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const AudioIcon = props => /*#__PURE__*/_react.default.createElement(_audio.default, Object.assign({
  LEGACY_fallbackIcon: _audio2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
AudioIcon.Name = 'AudioIconMigration';
var _default = exports.default = AudioIcon;