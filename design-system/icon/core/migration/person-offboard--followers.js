/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::697920b16c95a77e5dc68d5266f69141>>
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
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
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
  LEGACY_fallbackIcon: _followers.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
PersonOffboardIcon.Name = 'PersonOffboardIconMigration';
var _default = exports.default = PersonOffboardIcon;