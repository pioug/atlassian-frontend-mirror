/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::11aab62d49f71f052487ab6cf09d42c7>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _chartBar = _interopRequireDefault(require("@atlaskit/icon/core/chart-bar"));
var _graphBar = _interopRequireDefault(require("@atlaskit/icon/glyph/graph-bar"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for ChartBarIcon.
 * This component is ChartBarIcon, with `UNSAFE_fallbackIcon` set to "GraphBarIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: Reports in JSM, Space Analytics in Confluence, and other graph charts.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ChartBarIcon = props => /*#__PURE__*/_react.default.createElement(_chartBar.default, Object.assign({
  LEGACY_fallbackIcon: _graphBar.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ChartBarIcon.Name = 'ChartBarIconMigration';
var _default = exports.default = ChartBarIcon;