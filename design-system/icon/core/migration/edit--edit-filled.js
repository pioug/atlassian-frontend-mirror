"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _edit = _interopRequireDefault(require("@atlaskit/icon/core/edit"));
var _editFilled = _interopRequireDefault(require("@atlaskit/icon/glyph/edit-filled"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for EditIcon.
 * This component is EditIcon, with `UNSAFE_fallbackIcon` set to "EditFilledIcon".
 *
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for editing objects.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const EditIcon = props => /*#__PURE__*/_react.default.createElement(_edit.default, Object.assign({
  LEGACY_fallbackIcon: _editFilled.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
EditIcon.Name = 'EditIconMigration';
var _default = exports.default = EditIcon;