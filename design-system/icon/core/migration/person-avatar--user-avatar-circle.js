/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::87e7af881897ed302561350d986556a5>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _personAvatar = _interopRequireDefault(require("@atlaskit/icon/core/person-avatar"));
var _userAvatarCircle = _interopRequireDefault(require("@atlaskit/icon/glyph/user-avatar-circle"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for PersonAvatarIcon.
 * This component is PersonAvatarIcon, with `UNSAFE_fallbackIcon` set to "UserAvatarCircleIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for user avatar.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const PersonAvatarIcon = props => /*#__PURE__*/_react.default.createElement(_personAvatar.default, Object.assign({
  LEGACY_fallbackIcon: _userAvatarCircle.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
PersonAvatarIcon.Name = 'PersonAvatarIconMigration';
var _default = exports.default = PersonAvatarIcon;