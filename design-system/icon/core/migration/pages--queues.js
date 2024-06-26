"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _pages = _interopRequireDefault(require("@atlaskit/icon/core/pages"));
var _queues = _interopRequireDefault(require("@atlaskit/icon/glyph/queues"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for PagesIcon.
 * This component is PagesIcon, with `UNSAFE_fallbackIcon` set to "QueuesIcon".
 *
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for multipe pages in Confluence.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const PagesIcon = props => /*#__PURE__*/_react.default.createElement(_pages.default, Object.assign({
  LEGACY_fallbackIcon: _queues.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
PagesIcon.Name = 'PagesIconMigration';
var _default = exports.default = PagesIcon;