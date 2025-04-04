/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::856a9abd2f2917165082d78a9be3e71c>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _chartBar = _interopRequireDefault(require("@atlaskit/icon/core/chart-bar"));
var _presentation = _interopRequireDefault(require("@atlaskit/icon/glyph/media-services/presentation"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for ChartBarIcon.
 * This component is ChartBarIcon, with `UNSAFE_fallbackIcon` set to "MediaServicesPresentationIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: Reports in JSM, Space Analytics in Confluence, and other graph charts.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ChartBarIcon = props => /*#__PURE__*/_react.default.createElement(_chartBar.default, Object.assign({
  LEGACY_fallbackIcon: _presentation.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ChartBarIcon.Name = 'ChartBarIconMigration';
var _default = exports.default = ChartBarIcon;