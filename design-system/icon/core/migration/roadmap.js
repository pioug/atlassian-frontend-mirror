/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::e8c440cf3000c9503b678f772dfefcdf>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _roadmap = _interopRequireDefault(require("@atlaskit/icon/core/roadmap"));
var _roadmap2 = _interopRequireDefault(require("@atlaskit/icon/glyph/roadmap"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for RoadmapIcon.
 * This component is RoadmapIcon, with `UNSAFE_fallbackIcon` set to "RoadmapIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for roadmaps in Jira or Trello.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const RoadmapIcon = props => /*#__PURE__*/_react.default.createElement(_roadmap.default, Object.assign({
  name: "RoadmapIcon",
  LEGACY_fallbackIcon: _roadmap2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
RoadmapIcon.displayName = 'RoadmapIconMigration';
var _default = exports.default = RoadmapIcon;