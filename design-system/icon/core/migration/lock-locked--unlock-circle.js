/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::4b851d8afc2d49606f0f62ccfa0d99f1>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _lockLocked = _interopRequireDefault(require("@atlaskit/icon/core/lock-locked"));
var _unlockCircle = _interopRequireDefault(require("@atlaskit/icon/glyph/unlock-circle"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for LockLockedIcon.
 * This component is LockLockedIcon, with `UNSAFE_fallbackIcon` set to "UnlockCircleIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Known uses: secure password in textfields, locked page in Confluence.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const LockLockedIcon = props => /*#__PURE__*/_react.default.createElement(_lockLocked.default, Object.assign({
  LEGACY_fallbackIcon: _unlockCircle.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
LockLockedIcon.Name = 'LockLockedIconMigration';
var _default = exports.default = LockLockedIcon;