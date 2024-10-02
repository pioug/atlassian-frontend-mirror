/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::c21a9bb13a8d6da0d79ca9ba44d96a29>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _listBulleted = _interopRequireDefault(require("@atlaskit/icon/core/list-bulleted"));
var _bulletList = _interopRequireDefault(require("@atlaskit/icon/glyph/bullet-list"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for ListBulletedIcon.
 * This component is ListBulletedIcon, with `UNSAFE_fallbackIcon` set to "BulletListIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: bulleted lists, view all.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ListBulletedIcon = props => /*#__PURE__*/_react.default.createElement(_listBulleted.default, Object.assign({
  LEGACY_fallbackIcon: _bulletList.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ListBulletedIcon.Name = 'ListBulletedIconMigration';
var _default = exports.default = ListBulletedIcon;