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
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for AudioIcon.
 * This component is AudioIcon, with `UNSAFE_fallbackIcon` set to "AudioIcon".
 *
 * Category: Single-purpose
 * Location: Icon contributions
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const AudioIcon = props => /*#__PURE__*/_react.default.createElement(_audio.default, Object.assign({
  LEGACY_fallbackIcon: _audio2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
AudioIcon.Name = 'AudioIconMigration';
var _default = exports.default = AudioIcon;