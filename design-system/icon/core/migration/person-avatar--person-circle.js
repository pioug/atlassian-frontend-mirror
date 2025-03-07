/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::c11af61bf1d5e1e60e3ad123179be896>>
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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
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