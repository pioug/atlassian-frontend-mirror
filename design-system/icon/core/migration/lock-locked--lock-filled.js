/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::326b910dfaba5cc8a1474883638588aa>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _lockLocked = _interopRequireDefault(require("@atlaskit/icon/core/lock-locked"));
var _lockFilled = _interopRequireDefault(require("@atlaskit/icon/glyph/lock-filled"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for LockLockedIcon.
 * This component is LockLockedIcon, with `UNSAFE_fallbackIcon` set to "LockFilledIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Known uses: secure password in textfields, locked page in Confluence.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const LockLockedIcon = props => /*#__PURE__*/_react.default.createElement(_lockLocked.default, Object.assign({
  LEGACY_fallbackIcon: _lockFilled.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
LockLockedIcon.Name = 'LockLockedIconMigration';
var _default = exports.default = LockLockedIcon;