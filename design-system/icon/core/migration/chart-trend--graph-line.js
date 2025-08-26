/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::fafbc29b80aea932024b1cb1b7fd7e66>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _chartTrend = _interopRequireDefault(require("@atlaskit/icon/core/chart-trend"));
var _graphLine = _interopRequireDefault(require("@atlaskit/icon/glyph/graph-line"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for ChartTrendIcon.
 * This component is ChartTrendIcon, with `UNSAFE_fallbackIcon` set to "GraphLineIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: charts, reports in Jira, and sprint insights.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ChartTrendIcon = props => /*#__PURE__*/_react.default.createElement(_chartTrend.default, Object.assign({
  name: "ChartTrendIcon",
  LEGACY_fallbackIcon: _graphLine.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ChartTrendIcon.displayName = 'ChartTrendIconMigration';
var _default = exports.default = ChartTrendIcon;