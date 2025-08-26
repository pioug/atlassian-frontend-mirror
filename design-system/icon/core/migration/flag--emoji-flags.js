/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::3c50856522633b4ee0e27e4e0f550857>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _flag = _interopRequireDefault(require("@atlaskit/icon/core/flag"));
var _flags = _interopRequireDefault(require("@atlaskit/icon/glyph/emoji/flags"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for FlagIcon.
 * This component is FlagIcon, with `UNSAFE_fallbackIcon` set to "EmojiFlagsIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: flags in Editor, feature flags.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const FlagIcon = props => /*#__PURE__*/_react.default.createElement(_flag.default, Object.assign({
  name: "FlagIcon",
  LEGACY_fallbackIcon: _flags.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
FlagIcon.displayName = 'FlagIconMigration';
var _default = exports.default = FlagIcon;