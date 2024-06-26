"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _globe = _interopRequireDefault(require("@atlaskit/icon/core/globe"));
var _world = _interopRequireDefault(require("@atlaskit/icon/glyph/world"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for GlobeIcon.
 * This component is GlobeIcon, with `UNSAFE_fallbackIcon` set to "WorldIcon".
 *
 * Category: Multi-purpose
 * Location: ADS
 * Usage guidance: Known uses: public link in Confluence share dialog, global rules in Automation.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const GlobeIcon = props => /*#__PURE__*/_react.default.createElement(_globe.default, Object.assign({
  LEGACY_fallbackIcon: _world.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
GlobeIcon.Name = 'GlobeIconMigration';
var _default = exports.default = GlobeIcon;