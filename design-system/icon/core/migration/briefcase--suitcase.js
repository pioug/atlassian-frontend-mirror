"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _briefcase = _interopRequireDefault(require("@atlaskit/icon/core/briefcase"));
var _suitcase = _interopRequireDefault(require("@atlaskit/icon/glyph/suitcase"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for BriefcaseIcon.
 * This component is BriefcaseIcon, with `UNSAFE_fallbackIcon` set to "SuitcaseIcon".
 *
 * Category: Multi-purpose
 * Location: Icon contributions
 * Usage guidance: Known uses: Job title in Atlas, Operations in JSM.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const BriefcaseIcon = props => /*#__PURE__*/_react.default.createElement(_briefcase.default, Object.assign({
  LEGACY_fallbackIcon: _suitcase.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
BriefcaseIcon.Name = 'BriefcaseIconMigration';
var _default = exports.default = BriefcaseIcon;