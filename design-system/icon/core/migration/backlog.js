"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _backlog = _interopRequireDefault(require("@atlaskit/icon/core/backlog"));
var _backlog2 = _interopRequireDefault(require("@atlaskit/icon/glyph/backlog"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for BacklogIcon.
 * This component is BacklogIcon, with `UNSAFE_fallbackIcon` set to "BacklogIcon".
 *
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for backlogs in Jira.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const BacklogIcon = props => /*#__PURE__*/_react.default.createElement(_backlog.default, Object.assign({
  LEGACY_fallbackIcon: _backlog2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
BacklogIcon.Name = 'BacklogIconMigration';
var _default = exports.default = BacklogIcon;