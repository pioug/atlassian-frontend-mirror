/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::28ea7cd93eeb01fb4212071976f0b2ab>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _snippet = _interopRequireDefault(require("@atlaskit/icon/core/snippet"));
var _snippets = _interopRequireDefault(require("@atlaskit/icon/glyph/bitbucket/snippets"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for SnippetIcon.
 * This component is SnippetIcon, with `UNSAFE_fallbackIcon` set to "BitbucketSnippetsIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for snippets in Bitbucket.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const SnippetIcon = props => /*#__PURE__*/_react.default.createElement(_snippet.default, Object.assign({
  LEGACY_fallbackIcon: _snippets.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
SnippetIcon.Name = 'SnippetIconMigration';
var _default = exports.default = SnippetIcon;