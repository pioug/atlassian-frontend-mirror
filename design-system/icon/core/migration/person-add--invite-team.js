/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::e830e4067031d4762f99d591dcd46eb1>>
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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for PersonAddIcon.
 * This component is PersonAddIcon, with `UNSAFE_fallbackIcon` set to "InviteTeamIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for adding a user to an object.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const PersonAddIcon = props => /*#__PURE__*/_react.default.createElement(_personAdd.default, Object.assign({
  LEGACY_fallbackIcon: _inviteTeam.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
PersonAddIcon.Name = 'PersonAddIconMigration';
var _default = exports.default = PersonAddIcon;