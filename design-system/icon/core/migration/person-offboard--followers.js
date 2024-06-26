"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _personOffboard = _interopRequireDefault(require("@atlaskit/icon/core/person-offboard"));
var _followers = _interopRequireDefault(require("@atlaskit/icon/glyph/followers"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for PersonOffboardIcon.
 * This component is PersonOffboardIcon, with `UNSAFE_fallbackIcon` set to "FollowersIcon".
 *
 * Category: Single-purpose
 * Location: ADS
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const PersonOffboardIcon = props => /*#__PURE__*/_react.default.createElement(_personOffboard.default, Object.assign({
  LEGACY_fallbackIcon: _followers.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
PersonOffboardIcon.Name = 'PersonOffboardIconMigration';
var _default = exports.default = PersonOffboardIcon;