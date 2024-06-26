"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _delete = _interopRequireDefault(require("@atlaskit/icon/core/delete"));
var _remove = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/remove"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for DeleteIcon.
 * This component is DeleteIcon, with `UNSAFE_fallbackIcon` set to "EditorRemoveIcon".
 *
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for removing or deleting an object.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const DeleteIcon = props => /*#__PURE__*/_react.default.createElement(_delete.default, Object.assign({
  LEGACY_fallbackIcon: _remove.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
DeleteIcon.Name = 'DeleteIconMigration';
var _default = exports.default = DeleteIcon;