"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _crossCircle = _interopRequireDefault(require("@atlaskit/icon/core/cross-circle"));
var _error = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/error"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for CrossCircleIcon.
 * This component is CrossCircleIcon, with `UNSAFE_fallbackIcon` set to "EditorErrorIcon".
 *
 * Category: Multi-purpose
 * Location: ADS
 * Usage guidance: Known uses: clear text field, error status icon.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CrossCircleIcon = props => /*#__PURE__*/_react.default.createElement(_crossCircle.default, Object.assign({
  LEGACY_fallbackIcon: _error.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CrossCircleIcon.Name = 'CrossCircleIconMigration';
var _default = exports.default = CrossCircleIcon;