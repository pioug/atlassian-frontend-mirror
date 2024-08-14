/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::d354d8d3e3af6c6a81e028fc2397da32>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _collapse = _interopRequireDefault(require("@atlaskit/icon/core/collapse"));
var _collapse2 = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/collapse"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for CollapseIcon.
 * This component is CollapseIcon, with `UNSAFE_fallbackIcon` set to "EditorCollapseIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for contracting or reducing the width of an element.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CollapseIcon = props => /*#__PURE__*/_react.default.createElement(_collapse.default, Object.assign({
  LEGACY_fallbackIcon: _collapse2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CollapseIcon.Name = 'CollapseIconMigration';
var _default = exports.default = CollapseIcon;