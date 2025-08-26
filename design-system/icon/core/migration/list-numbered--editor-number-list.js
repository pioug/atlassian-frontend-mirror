/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::6037f83b84c7668cea5207d550175115>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _listNumbered = _interopRequireDefault(require("@atlaskit/icon/core/list-numbered"));
var _numberList = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/number-list"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for ListNumberedIcon.
 * This component is ListNumberedIcon, with `UNSAFE_fallbackIcon` set to "EditorNumberListIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known usages: Numbered list in Confluence Editor.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ListNumberedIcon = props => /*#__PURE__*/_react.default.createElement(_listNumbered.default, Object.assign({
  name: "ListNumberedIcon",
  LEGACY_fallbackIcon: _numberList.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ListNumberedIcon.displayName = 'ListNumberedIconMigration';
var _default = exports.default = ListNumberedIcon;