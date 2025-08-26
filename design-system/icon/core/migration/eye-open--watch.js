/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::a82b3023d120d1cddcc651115b89d980>>
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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for EyeOpenIcon.
 * This component is EyeOpenIcon, with `UNSAFE_fallbackIcon` set to "WatchIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: watch page in Confluence, show password in text field, and following in Atlas.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const EyeOpenIcon = props => /*#__PURE__*/_react.default.createElement(_eyeOpen.default, Object.assign({
  name: "EyeOpenIcon",
  LEGACY_fallbackIcon: _watch.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
EyeOpenIcon.displayName = 'EyeOpenIconMigration';
var _default = exports.default = EyeOpenIcon;