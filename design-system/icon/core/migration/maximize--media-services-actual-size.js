/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::3c1e220edd524eab7731978d0f35419c>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _maximize = _interopRequireDefault(require("@atlaskit/icon/core/maximize"));
var _actualSize = _interopRequireDefault(require("@atlaskit/icon/glyph/media-services/actual-size"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for MaximizeIcon.
 * This component is MaximizeIcon, with `UNSAFE_fallbackIcon` set to "MediaServicesActualSizeIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for maximizing screens, panels, or objects.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const MaximizeIcon = props => /*#__PURE__*/_react.default.createElement(_maximize.default, Object.assign({
  LEGACY_fallbackIcon: _actualSize.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
MaximizeIcon.Name = 'MaximizeIconMigration';
var _default = exports.default = MaximizeIcon;