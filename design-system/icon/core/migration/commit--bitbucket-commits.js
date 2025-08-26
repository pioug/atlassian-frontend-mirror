/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::65dcf966fa1dbb205774996c18f11012>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _commit = _interopRequireDefault(require("@atlaskit/icon/core/commit"));
var _commits = _interopRequireDefault(require("@atlaskit/icon/glyph/bitbucket/commits"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for CommitIcon.
 * This component is CommitIcon, with `UNSAFE_fallbackIcon` set to "BitbucketCommitsIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for commits in Jira or Bitbucket.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CommitIcon = props => /*#__PURE__*/_react.default.createElement(_commit.default, Object.assign({
  name: "CommitIcon",
  LEGACY_fallbackIcon: _commits.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CommitIcon.displayName = 'CommitIconMigration';
var _default = exports.default = CommitIcon;