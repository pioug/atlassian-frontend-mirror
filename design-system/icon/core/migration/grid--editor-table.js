/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::ca341356ec7e14a1634869a278921cc5>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _grid = _interopRequireDefault(require("@atlaskit/icon/core/grid"));
var _table = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/table"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for GridIcon.
 * This component is GridIcon, with `UNSAFE_fallbackIcon` set to "EditorTableIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: spaces in Confluence, and grid view, all content in Confluence.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const GridIcon = props => /*#__PURE__*/_react.default.createElement(_grid.default, Object.assign({
  name: "GridIcon",
  LEGACY_fallbackIcon: _table.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
GridIcon.displayName = 'GridIconMigration';
var _default = exports.default = GridIcon;