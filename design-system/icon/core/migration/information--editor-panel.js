/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::4536629b00c3c567820ff2d9adf18069>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _information = _interopRequireDefault(require("@atlaskit/icon/core/information"));
var _panel = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/panel"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for InformationIcon.
 * This component is InformationIcon, with `UNSAFE_fallbackIcon` set to "EditorPanelIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Known uses: helper message under textfield, information state insection messages.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const InformationIcon = props => /*#__PURE__*/_react.default.createElement(_information.default, Object.assign({
  LEGACY_fallbackIcon: _panel.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
InformationIcon.Name = 'InformationIconMigration';
var _default = exports.default = InformationIcon;