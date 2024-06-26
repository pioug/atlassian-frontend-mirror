"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _eyeOpenFilled = _interopRequireDefault(require("@atlaskit/icon/core/eye-open-filled"));
var _watchFilled = _interopRequireDefault(require("@atlaskit/icon/glyph/watch-filled"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for EyeOpenFilledIcon.
 * This component is EyeOpenFilledIcon, with `UNSAFE_fallbackIcon` set to "WatchFilledIcon".
 *
 * Category: Multi-purpose
 * Location: ADS
 * Usage guidance: Known uses: watched pages in Confluence.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const EyeOpenFilledIcon = props => /*#__PURE__*/_react.default.createElement(_eyeOpenFilled.default, Object.assign({
  LEGACY_fallbackIcon: _watchFilled.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
EyeOpenFilledIcon.Name = 'EyeOpenFilledIconMigration';
var _default = exports.default = EyeOpenFilledIcon;