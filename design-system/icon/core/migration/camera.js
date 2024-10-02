/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::a490c36d955e61064bb1a8916a7ef7a0>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _camera = _interopRequireDefault(require("@atlaskit/icon/core/camera"));
var _camera2 = _interopRequireDefault(require("@atlaskit/icon/glyph/camera"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for CameraIcon.
 * This component is CameraIcon, with `UNSAFE_fallbackIcon` set to "CameraIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: upload photo in Trello, photos.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CameraIcon = props => /*#__PURE__*/_react.default.createElement(_camera.default, Object.assign({
  LEGACY_fallbackIcon: _camera2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CameraIcon.Name = 'CameraIconMigration';
var _default = exports.default = CameraIcon;