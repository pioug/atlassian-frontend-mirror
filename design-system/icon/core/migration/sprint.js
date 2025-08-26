/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::e75fab60b8db5b6f9a3ac597aa211c61>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _sprint = _interopRequireDefault(require("@atlaskit/icon/core/sprint"));
var _sprint2 = _interopRequireDefault(require("@atlaskit/icon/glyph/sprint"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for SprintIcon.
 * This component is SprintIcon, with `UNSAFE_fallbackIcon` set to "SprintIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for sprints in Jira.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const SprintIcon = props => /*#__PURE__*/_react.default.createElement(_sprint.default, Object.assign({
  name: "SprintIcon",
  LEGACY_fallbackIcon: _sprint2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
SprintIcon.displayName = 'SprintIconMigration';
var _default = exports.default = SprintIcon;