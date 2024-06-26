"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _flask = _interopRequireDefault(require("@atlaskit/icon/core/flask"));
var _labs = _interopRequireDefault(require("@atlaskit/icon/glyph/jira/labs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for FlaskIcon.
 * This component is FlaskIcon, with `UNSAFE_fallbackIcon` set to "JiraLabsIcon".
 *
 * Category: Multi-purpose
 * Location: Icon contributions
 * Usage guidance: Known uses: labs in Jira.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const FlaskIcon = props => /*#__PURE__*/_react.default.createElement(_flask.default, Object.assign({
  LEGACY_fallbackIcon: _labs.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
FlaskIcon.Name = 'FlaskIconMigration';
var _default = exports.default = FlaskIcon;