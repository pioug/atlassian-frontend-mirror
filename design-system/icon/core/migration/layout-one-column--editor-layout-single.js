/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::ec7d4168cc789e624df258d7c76e544e>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _layoutOneColumn = _interopRequireDefault(require("@atlaskit/icon/core/layout-one-column"));
var _layoutSingle = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/layout-single"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for LayoutOneColumnIcon.
 * This component is LayoutOneColumnIcon, with `UNSAFE_fallbackIcon` set to "EditorLayoutSingleIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for single column layout option in Confluence Editor
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const LayoutOneColumnIcon = props => /*#__PURE__*/_react.default.createElement(_layoutOneColumn.default, Object.assign({
  LEGACY_fallbackIcon: _layoutSingle.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
LayoutOneColumnIcon.Name = 'LayoutOneColumnIconMigration';
var _default = exports.default = LayoutOneColumnIcon;