/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::93e2a5ab601f6cc4b6e4995c107737be>>
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