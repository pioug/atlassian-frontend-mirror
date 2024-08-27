/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::1e7ec4337c046146feffcf85a4b64e33>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _personAvatar = _interopRequireDefault(require("@atlaskit/icon/core/person-avatar"));
var _personCircle = _interopRequireDefault(require("@atlaskit/icon/glyph/person-circle"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for PersonAvatarIcon.
 * This component is PersonAvatarIcon, with `UNSAFE_fallbackIcon` set to "PersonCircleIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for user avatar.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const PersonAvatarIcon = props => /*#__PURE__*/_react.default.createElement(_personAvatar.default, Object.assign({
  LEGACY_fallbackIcon: _personCircle.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
PersonAvatarIcon.Name = 'PersonAvatarIconMigration';
var _default = exports.default = PersonAvatarIcon;