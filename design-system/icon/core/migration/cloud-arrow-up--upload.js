"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _cloudArrowUp = _interopRequireDefault(require("@atlaskit/icon/core/cloud-arrow-up"));
var _upload = _interopRequireDefault(require("@atlaskit/icon/glyph/upload"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for CloudArrowUpIcon.
 * This component is CloudArrowUpIcon, with `UNSAFE_fallbackIcon` set to "UploadIcon".
 *
 * Category: Multi-purpose
 * Location: ADS
 * Usage guidance: Known uses: deployments in Jira.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CloudArrowUpIcon = props => /*#__PURE__*/_react.default.createElement(_cloudArrowUp.default, Object.assign({
  LEGACY_fallbackIcon: _upload.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CloudArrowUpIcon.Name = 'CloudArrowUpIconMigration';
var _default = exports.default = CloudArrowUpIcon;