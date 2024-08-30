/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::8cfa72e485bead64a4cde147684c2930>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _expand = _interopRequireDefault(require("@atlaskit/icon/core/expand"));
var _expand2 = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/expand"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for ExpandIcon.
 * This component is ExpandIcon, with `UNSAFE_fallbackIcon` set to "EditorExpandIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for resizing screens, panels, modals, or media to its maximum size.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ExpandIcon = props => /*#__PURE__*/_react.default.createElement(_expand.default, Object.assign({
  LEGACY_fallbackIcon: _expand2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ExpandIcon.Name = 'ExpandIconMigration';
var _default = exports.default = ExpandIcon;