/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::4a899c7ff2dc66de5fd01a6eda203f26>>
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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for RoadmapIcon.
 * This component is RoadmapIcon, with `UNSAFE_fallbackIcon` set to "RoadmapIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for roadmaps in Jira or Trello.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const RoadmapIcon = props => /*#__PURE__*/_react.default.createElement(_roadmap.default, Object.assign({
  LEGACY_fallbackIcon: _roadmap2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
RoadmapIcon.Name = 'RoadmapIconMigration';
var _default = exports.default = RoadmapIcon;