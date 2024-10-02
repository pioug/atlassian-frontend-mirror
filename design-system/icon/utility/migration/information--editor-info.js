/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::20f8048fef8f8606f24b147f43461a1e>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _information = _interopRequireDefault(require("@atlaskit/icon/utility/information"));
var _info = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/info"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for InformationIcon.
 * This component is InformationIcon, with `UNSAFE_fallbackIcon` set to "EditorInfoIcon".
 *
 * Category: utility
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for Helper Messages in Forms.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const InformationIcon = props => /*#__PURE__*/_react.default.createElement(_information.default, Object.assign({
  LEGACY_fallbackIcon: _info.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
InformationIcon.Name = 'InformationIconMigration';
var _default = exports.default = InformationIcon;