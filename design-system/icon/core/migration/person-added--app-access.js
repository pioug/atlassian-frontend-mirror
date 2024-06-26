"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _personAdded = _interopRequireDefault(require("@atlaskit/icon/core/person-added"));
var _appAccess = _interopRequireDefault(require("@atlaskit/icon/glyph/app-access"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for PersonAddedIcon.
 * This component is PersonAddedIcon, with `UNSAFE_fallbackIcon` set to "AppAccessIcon".
 *
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for a user added to an object.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const PersonAddedIcon = props => /*#__PURE__*/_react.default.createElement(_personAdded.default, Object.assign({
  LEGACY_fallbackIcon: _appAccess.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
PersonAddedIcon.Name = 'PersonAddedIconMigration';
var _default = exports.default = PersonAddedIcon;