"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _camera = _interopRequireDefault(require("@atlaskit/icon/core/camera"));
var _photo = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/photo"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for CameraIcon.
 * This component is CameraIcon, with `UNSAFE_fallbackIcon` set to "EditorPhotoIcon".
 *
 * Category: Multi-purpose
 * Location: Icon contributions
 * Usage guidance: Known uses: upload photo in Trello, photos.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CameraIcon = props => /*#__PURE__*/_react.default.createElement(_camera.default, Object.assign({
  LEGACY_fallbackIcon: _photo.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CameraIcon.Name = 'CameraIconMigration';
var _default = exports.default = CameraIcon;