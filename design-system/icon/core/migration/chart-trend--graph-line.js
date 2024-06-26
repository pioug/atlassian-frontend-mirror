"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _chartTrend = _interopRequireDefault(require("@atlaskit/icon/core/chart-trend"));
var _graphLine = _interopRequireDefault(require("@atlaskit/icon/glyph/graph-line"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for ChartTrendIcon.
 * This component is ChartTrendIcon, with `UNSAFE_fallbackIcon` set to "GraphLineIcon".
 *
 * Category: Multi-purpose
 * Location: Icon contributions
 * Usage guidance: Known uses: charts, reports in Jira, and sprint insights.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ChartTrendIcon = props => /*#__PURE__*/_react.default.createElement(_chartTrend.default, Object.assign({
  LEGACY_fallbackIcon: _graphLine.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ChartTrendIcon.Name = 'ChartTrendIconMigration';
var _default = exports.default = ChartTrendIcon;