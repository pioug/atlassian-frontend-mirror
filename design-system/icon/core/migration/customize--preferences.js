"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _customize = _interopRequireDefault(require("@atlaskit/icon/core/customize"));
var _preferences = _interopRequireDefault(require("@atlaskit/icon/glyph/preferences"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for CustomizeIcon.
 * This component is CustomizeIcon, with `UNSAFE_fallbackIcon` set to "PreferencesIcon".
 *
 * Category: Multi-purpose
 * Location: ADS
 * Usage guidance: Known uses: modify a sidebar order, change view, settings.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CustomizeIcon = props => /*#__PURE__*/_react.default.createElement(_customize.default, Object.assign({
  LEGACY_fallbackIcon: _preferences.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CustomizeIcon.Name = 'CustomizeIconMigration';
var _default = exports.default = CustomizeIcon;