/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::4af43bf1fcb01719c68cb846698cd43f>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _audio = _interopRequireDefault(require("@atlaskit/icon/core/audio"));
var _audioCircle = _interopRequireDefault(require("@atlaskit/icon/glyph/audio-circle"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for AudioIcon.
 * This component is AudioIcon, with `UNSAFE_fallbackIcon` set to "AudioCircleIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const AudioIcon = props => /*#__PURE__*/_react.default.createElement(_audio.default, Object.assign({
  LEGACY_fallbackIcon: _audioCircle.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
AudioIcon.Name = 'AudioIconMigration';
var _default = exports.default = AudioIcon;