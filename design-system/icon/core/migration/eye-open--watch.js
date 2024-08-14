/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::0143b9664df58593087bf568bbc3a359>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _eyeOpen = _interopRequireDefault(require("@atlaskit/icon/core/eye-open"));
var _watch = _interopRequireDefault(require("@atlaskit/icon/glyph/watch"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for EyeOpenIcon.
 * This component is EyeOpenIcon, with `UNSAFE_fallbackIcon` set to "WatchIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Known uses: watch page in Confluence, show password in text field, and following in Atlas.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const EyeOpenIcon = props => /*#__PURE__*/_react.default.createElement(_eyeOpen.default, Object.assign({
  LEGACY_fallbackIcon: _watch.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
EyeOpenIcon.Name = 'EyeOpenIconMigration';
var _default = exports.default = EyeOpenIcon;