/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::b241df9bd92ca2a346a1131e0750d455>>
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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for GridIcon.
 * This component is GridIcon, with `UNSAFE_fallbackIcon` set to "EditorTableIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Known uses: spaces in Confluence, and grid view, all content in Confluence.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const GridIcon = props => /*#__PURE__*/_react.default.createElement(_grid.default, Object.assign({
  LEGACY_fallbackIcon: _table.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
GridIcon.Name = 'GridIconMigration';
var _default = exports.default = GridIcon;