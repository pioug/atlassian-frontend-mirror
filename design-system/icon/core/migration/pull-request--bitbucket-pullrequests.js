/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::47ea83924e7cf78af0a51ca6ff1b9c05>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _pullRequest = _interopRequireDefault(require("@atlaskit/icon/core/pull-request"));
var _pullrequests = _interopRequireDefault(require("@atlaskit/icon/glyph/bitbucket/pullrequests"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for PullRequestIcon.
 * This component is PullRequestIcon, with `UNSAFE_fallbackIcon` set to "BitbucketPullrequestsIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for pull requests.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const PullRequestIcon = props => /*#__PURE__*/_react.default.createElement(_pullRequest.default, Object.assign({
  name: "PullRequestIcon",
  LEGACY_fallbackIcon: _pullrequests.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
PullRequestIcon.displayName = 'PullRequestIconMigration';
var _default = exports.default = PullRequestIcon;