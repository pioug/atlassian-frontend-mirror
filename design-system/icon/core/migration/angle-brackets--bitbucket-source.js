/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::e13bf6f46e22b751c7eed9d3cf6a21a0>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _angleBrackets = _interopRequireDefault(require("@atlaskit/icon/core/angle-brackets"));
var _source = _interopRequireDefault(require("@atlaskit/icon/glyph/bitbucket/source"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for AngleBracketsIcon.
 * This component is AngleBracketsIcon, with `UNSAFE_fallbackIcon` set to "BitbucketSourceIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: code or source code in Bitbucket and Jira.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const AngleBracketsIcon = props => /*#__PURE__*/_react.default.createElement(_angleBrackets.default, Object.assign({
  LEGACY_fallbackIcon: _source.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
AngleBracketsIcon.Name = 'AngleBracketsIconMigration';
var _default = exports.default = AngleBracketsIcon;