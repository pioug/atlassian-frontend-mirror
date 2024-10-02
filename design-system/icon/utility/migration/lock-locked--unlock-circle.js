/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::ac002ba364022e4779154cf0505e004d>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _lockLocked = _interopRequireDefault(require("@atlaskit/icon/utility/lock-locked"));
var _unlockCircle = _interopRequireDefault(require("@atlaskit/icon/glyph/unlock-circle"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for LockLockedIcon.
 * This component is LockLockedIcon, with `UNSAFE_fallbackIcon` set to "UnlockCircleIcon".
 *
 * Category: utility
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for indicating something is locked in the side navigation Menu Item.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const LockLockedIcon = props => /*#__PURE__*/_react.default.createElement(_lockLocked.default, Object.assign({
  LEGACY_fallbackIcon: _unlockCircle.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
LockLockedIcon.Name = 'LockLockedIconMigration';
var _default = exports.default = LockLockedIcon;