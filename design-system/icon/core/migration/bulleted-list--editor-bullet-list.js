/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::c902d232d36bf8c4f9645e1e9ae77feb>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _bulletedList = _interopRequireDefault(require("@atlaskit/icon/core/bulleted-list"));
var _bulletList = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/bullet-list"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for BulletedListIcon.
 * This component is BulletedListIcon, with `UNSAFE_fallbackIcon` set to "EditorBulletListIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Known uses: bulleted lists, view all.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const BulletedListIcon = props => /*#__PURE__*/_react.default.createElement(_bulletedList.default, Object.assign({
  LEGACY_fallbackIcon: _bulletList.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
BulletedListIcon.Name = 'BulletedListIconMigration';
var _default = exports.default = BulletedListIcon;