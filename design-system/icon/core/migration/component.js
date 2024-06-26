"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _component = _interopRequireDefault(require("@atlaskit/icon/core/component"));
var _component2 = _interopRequireDefault(require("@atlaskit/icon/glyph/component"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for ComponentIcon.
 * This component is ComponentIcon, with `UNSAFE_fallbackIcon` set to "ComponentIcon".
 *
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for components in Jira and Compass.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ComponentIcon = props => /*#__PURE__*/_react.default.createElement(_component.default, Object.assign({
  LEGACY_fallbackIcon: _component2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ComponentIcon.Name = 'ComponentIconMigration';
var _default = exports.default = ComponentIcon;