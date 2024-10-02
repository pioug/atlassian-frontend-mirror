/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::e729cff048265e2c05f037874b246efd>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _lockUnlocked = _interopRequireDefault(require("@atlaskit/icon/core/lock-unlocked"));
var _unlockFilled = _interopRequireDefault(require("@atlaskit/icon/glyph/unlock-filled"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for LockUnlockedIcon.
 * This component is LockUnlockedIcon, with `UNSAFE_fallbackIcon` set to "UnlockFilledIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: unlocked page in Confluence.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const LockUnlockedIcon = props => /*#__PURE__*/_react.default.createElement(_lockUnlocked.default, Object.assign({
  LEGACY_fallbackIcon: _unlockFilled.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
LockUnlockedIcon.Name = 'LockUnlockedIconMigration';
var _default = exports.default = LockUnlockedIcon;