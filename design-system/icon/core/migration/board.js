"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _board = _interopRequireDefault(require("@atlaskit/icon/core/board"));
var _board2 = _interopRequireDefault(require("@atlaskit/icon/glyph/board"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for BoardIcon.
 * This component is BoardIcon, with `UNSAFE_fallbackIcon` set to "BoardIcon".
 *
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for boards in Jira.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const BoardIcon = props => /*#__PURE__*/_react.default.createElement(_board.default, Object.assign({
  LEGACY_fallbackIcon: _board2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
BoardIcon.Name = 'BoardIconMigration';
var _default = exports.default = BoardIcon;