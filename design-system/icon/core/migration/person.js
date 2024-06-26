"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _person = _interopRequireDefault(require("@atlaskit/icon/core/person"));
var _person2 = _interopRequireDefault(require("@atlaskit/icon/glyph/person"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for PersonIcon.
 * This component is PersonIcon, with `UNSAFE_fallbackIcon` set to "PersonIcon".
 *
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Known uses: representing a person or user, owner, contributor.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const PersonIcon = props => /*#__PURE__*/_react.default.createElement(_person.default, Object.assign({
  LEGACY_fallbackIcon: _person2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
PersonIcon.Name = 'PersonIconMigration';
var _default = exports.default = PersonIcon;