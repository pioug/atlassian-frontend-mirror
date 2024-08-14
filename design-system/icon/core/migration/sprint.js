/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::3d6bd789ee89ca719df5f1fe1fcd1864>>
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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for SprintIcon.
 * This component is SprintIcon, with `UNSAFE_fallbackIcon` set to "SprintIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for sprints in Jira.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const SprintIcon = props => /*#__PURE__*/_react.default.createElement(_sprint.default, Object.assign({
  LEGACY_fallbackIcon: _sprint2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
SprintIcon.Name = 'SprintIconMigration';
var _default = exports.default = SprintIcon;