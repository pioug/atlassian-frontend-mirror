"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _chartBar = _interopRequireDefault(require("@atlaskit/icon/core/chart-bar"));
var _presentation = _interopRequireDefault(require("@atlaskit/icon/glyph/media-services/presentation"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for ChartBarIcon.
 * This component is ChartBarIcon, with `UNSAFE_fallbackIcon` set to "MediaServicesPresentationIcon".
 *
 * Category: Multi-purpose
 * Location: Icon contributions
 * Usage guidance: Known uses: Reports in JSM, Space Analytics in Confluence, and other graph charts.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ChartBarIcon = props => /*#__PURE__*/_react.default.createElement(_chartBar.default, Object.assign({
  LEGACY_fallbackIcon: _presentation.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ChartBarIcon.Name = 'ChartBarIconMigration';
var _default = exports.default = ChartBarIcon;