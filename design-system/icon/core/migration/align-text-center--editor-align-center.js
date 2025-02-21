/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::04a654b3b1ec0246e60567550cf61dd6>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _alignTextCenter = _interopRequireDefault(require("@atlaskit/icon/core/align-text-center"));
var _alignCenter = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/align-center"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for AlignTextCenterIcon.
 * This component is AlignTextCenterIcon, with `UNSAFE_fallbackIcon` set to "EditorAlignCenterIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: align text center, align center.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const AlignTextCenterIcon = props => /*#__PURE__*/_react.default.createElement(_alignTextCenter.default, Object.assign({
  LEGACY_fallbackIcon: _alignCenter.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
AlignTextCenterIcon.Name = 'AlignTextCenterIconMigration';
var _default = exports.default = AlignTextCenterIcon;