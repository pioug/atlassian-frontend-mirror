/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::dc42c676c93bbd8ebbafcf12a5b740f7>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _eyeOpenFilled = _interopRequireDefault(require("@atlaskit/icon/core/eye-open-filled"));
var _watchFilled = _interopRequireDefault(require("@atlaskit/icon/glyph/watch-filled"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for EyeOpenFilledIcon.
 * This component is EyeOpenFilledIcon, with `UNSAFE_fallbackIcon` set to "WatchFilledIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: watched pages in Confluence.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const EyeOpenFilledIcon = props => /*#__PURE__*/_react.default.createElement(_eyeOpenFilled.default, Object.assign({
  LEGACY_fallbackIcon: _watchFilled.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
EyeOpenFilledIcon.Name = 'EyeOpenFilledIconMigration';
var _default = exports.default = EyeOpenFilledIcon;