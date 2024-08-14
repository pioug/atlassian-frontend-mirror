/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::c33d644f129d1371e61a383438868ee8>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _settings = _interopRequireDefault(require("@atlaskit/icon/core/settings"));
var _settings2 = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/settings"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for SettingsIcon.
 * This component is SettingsIcon, with `UNSAFE_fallbackIcon` set to "EditorSettingsIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for any object or user settings.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const SettingsIcon = props => /*#__PURE__*/_react.default.createElement(_settings.default, Object.assign({
  LEGACY_fallbackIcon: _settings2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
SettingsIcon.Name = 'SettingsIconMigration';
var _default = exports.default = SettingsIcon;