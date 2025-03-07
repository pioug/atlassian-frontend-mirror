/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::5542178d817edc545d522a7bd47318cd>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _lockUnlocked = _interopRequireDefault(require("@atlaskit/icon/utility/lock-unlocked"));
var _unlock = _interopRequireDefault(require("@atlaskit/icon/glyph/unlock"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for LockUnlockedIcon.
 * This component is LockUnlockedIcon, with `UNSAFE_fallbackIcon` set to "UnlockIcon".
 *
 * Category: utility
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for indicating something is locked in the side navigation Menu Item.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const LockUnlockedIcon = props => /*#__PURE__*/_react.default.createElement(_lockUnlocked.default, Object.assign({
  LEGACY_fallbackIcon: _unlock.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
LockUnlockedIcon.Name = 'LockUnlockedIconMigration';
var _default = exports.default = LockUnlockedIcon;