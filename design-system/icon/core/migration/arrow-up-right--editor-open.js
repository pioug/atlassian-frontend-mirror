"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _arrowUpRight = _interopRequireDefault(require("@atlaskit/icon/core/arrow-up-right"));
var _open = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/open"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for ArrowUpRightIcon.
 * This component is ArrowUpRightIcon, with `UNSAFE_fallbackIcon` set to "EditorOpenIcon".
 *
 * Category: Multi-purpose
 * Location: ADS
 * Usage guidance: Known uses: open a link in a new page (but not a new tab).
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ArrowUpRightIcon = props => /*#__PURE__*/_react.default.createElement(_arrowUpRight.default, Object.assign({
  LEGACY_fallbackIcon: _open.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ArrowUpRightIcon.Name = 'ArrowUpRightIconMigration';
var _default = exports.default = ArrowUpRightIcon;