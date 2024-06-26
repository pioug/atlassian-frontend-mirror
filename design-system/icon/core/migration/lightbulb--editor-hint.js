"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _lightbulb = _interopRequireDefault(require("@atlaskit/icon/core/lightbulb"));
var _hint = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/hint"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for LightbulbIcon.
 * This component is LightbulbIcon, with `UNSAFE_fallbackIcon` set to "EditorHintIcon".
 *
 * Category: Multi-purpose
 * Location: ADS
 * Usage guidance: Known uses: learnings in Atlas, initiatives in Jira.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const LightbulbIcon = props => /*#__PURE__*/_react.default.createElement(_lightbulb.default, Object.assign({
  LEGACY_fallbackIcon: _hint.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
LightbulbIcon.Name = 'LightbulbIconMigration';
var _default = exports.default = LightbulbIcon;