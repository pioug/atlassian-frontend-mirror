/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::3c29a4a378b4ad60fdefc9799783ffb3>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _alignCenter = _interopRequireDefault(require("@atlaskit/icon/core/align-center"));
var _alignCenter2 = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/align-center"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for AlignCenterIcon.
 * This component is AlignCenterIcon, with `UNSAFE_fallbackIcon` set to "EditorAlignCenterIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: align text center, align center.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const AlignCenterIcon = props => /*#__PURE__*/_react.default.createElement(_alignCenter.default, Object.assign({
  LEGACY_fallbackIcon: _alignCenter2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
AlignCenterIcon.Name = 'AlignCenterIconMigration';
var _default = exports.default = AlignCenterIcon;