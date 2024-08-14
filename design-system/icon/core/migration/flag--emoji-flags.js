/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::c0fa1e11577f66db68fa503f38df51cf>>
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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for FlagIcon.
 * This component is FlagIcon, with `UNSAFE_fallbackIcon` set to "EmojiFlagsIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Known uses: flags in Editor, feature flags.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const FlagIcon = props => /*#__PURE__*/_react.default.createElement(_flag.default, Object.assign({
  LEGACY_fallbackIcon: _flags.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
FlagIcon.Name = 'FlagIconMigration';
var _default = exports.default = FlagIcon;