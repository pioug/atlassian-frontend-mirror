"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _microphone = _interopRequireDefault(require("@atlaskit/icon/core/microphone"));
var _vidAudioOn = _interopRequireDefault(require("@atlaskit/icon/glyph/vid-audio-on"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for MicrophoneIcon.
 * This component is MicrophoneIcon, with `UNSAFE_fallbackIcon` set to "VidAudioOnIcon".
 *
 * Category: Multi-purpose
 * Location: Icon contributions
 * Usage guidance: Known uses: record sounds in Trello.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const MicrophoneIcon = props => /*#__PURE__*/_react.default.createElement(_microphone.default, Object.assign({
  LEGACY_fallbackIcon: _vidAudioOn.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
MicrophoneIcon.Name = 'MicrophoneIconMigration';
var _default = exports.default = MicrophoneIcon;