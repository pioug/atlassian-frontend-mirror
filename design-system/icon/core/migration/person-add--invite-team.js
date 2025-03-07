/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::0c28ad36bcbed963277bba2e64773578>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _personAdd = _interopRequireDefault(require("@atlaskit/icon/core/person-add"));
var _inviteTeam = _interopRequireDefault(require("@atlaskit/icon/glyph/invite-team"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for PersonAddIcon.
 * This component is PersonAddIcon, with `UNSAFE_fallbackIcon` set to "InviteTeamIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for adding a user to an object.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const PersonAddIcon = props => /*#__PURE__*/_react.default.createElement(_personAdd.default, Object.assign({
  LEGACY_fallbackIcon: _inviteTeam.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
PersonAddIcon.Name = 'PersonAddIconMigration';
var _default = exports.default = PersonAddIcon;