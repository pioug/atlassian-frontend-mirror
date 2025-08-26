/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::c9b2254d5749dd6664b86a7ea9dbc37b>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _personOffboard = _interopRequireDefault(require("@atlaskit/icon/core/person-offboard"));
var _followers = _interopRequireDefault(require("@atlaskit/icon/glyph/followers"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for PersonOffboardIcon.
 * This component is PersonOffboardIcon, with `UNSAFE_fallbackIcon` set to "FollowersIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: 📦 @atlaskit/icon/core/person-offboard
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const PersonOffboardIcon = props => /*#__PURE__*/_react.default.createElement(_personOffboard.default, Object.assign({
  name: "PersonOffboardIcon",
  LEGACY_fallbackIcon: _followers.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
PersonOffboardIcon.displayName = 'PersonOffboardIconMigration';
var _default = exports.default = PersonOffboardIcon;