/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::5db26519e9813775db7effa65e775e41>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _listBulleted = _interopRequireDefault(require("@atlaskit/icon/core/list-bulleted"));
var _bulletList = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/bullet-list"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for ListBulletedIcon.
 * This component is ListBulletedIcon, with `UNSAFE_fallbackIcon` set to "EditorBulletListIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: bulleted lists, view all.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ListBulletedIcon = props => /*#__PURE__*/_react.default.createElement(_listBulleted.default, Object.assign({
  name: "ListBulletedIcon",
  LEGACY_fallbackIcon: _bulletList.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ListBulletedIcon.displayName = 'ListBulletedIconMigration';
var _default = exports.default = ListBulletedIcon;