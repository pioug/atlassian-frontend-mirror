"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _personAvatar = _interopRequireDefault(require("@atlaskit/icon/core/person-avatar"));
var _userAvatarCircle = _interopRequireDefault(require("@atlaskit/icon/glyph/user-avatar-circle"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for PersonAvatarIcon.
 * This component is PersonAvatarIcon, with `UNSAFE_fallbackIcon` set to "UserAvatarCircleIcon".
 *
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for user avatar.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const PersonAvatarIcon = props => /*#__PURE__*/_react.default.createElement(_personAvatar.default, Object.assign({
  LEGACY_fallbackIcon: _userAvatarCircle.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
PersonAvatarIcon.Name = 'PersonAvatarIconMigration';
var _default = exports.default = PersonAvatarIcon;