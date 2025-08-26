/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::259cc1c6d3fd8bf043ca0c5d9ce57d64>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _angleBrackets = _interopRequireDefault(require("@atlaskit/icon/core/angle-brackets"));
var _repos = _interopRequireDefault(require("@atlaskit/icon/glyph/bitbucket/repos"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for AngleBracketsIcon.
 * This component is AngleBracketsIcon, with `UNSAFE_fallbackIcon` set to "BitbucketReposIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: code or source code in Bitbucket and Jira.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const AngleBracketsIcon = props => /*#__PURE__*/_react.default.createElement(_angleBrackets.default, Object.assign({
  name: "AngleBracketsIcon",
  LEGACY_fallbackIcon: _repos.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
AngleBracketsIcon.displayName = 'AngleBracketsIconMigration';
var _default = exports.default = AngleBracketsIcon;