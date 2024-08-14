/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::e3bd0b01e00c621e6fb6b91c4a72f19b>>
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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for PullRequestIcon.
 * This component is PullRequestIcon, with `UNSAFE_fallbackIcon` set to "BitbucketPullrequestsIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for pull requests in Jira or Bitbucket.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const PullRequestIcon = props => /*#__PURE__*/_react.default.createElement(_pullRequest.default, Object.assign({
  LEGACY_fallbackIcon: _pullrequests.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
PullRequestIcon.Name = 'PullRequestIconMigration';
var _default = exports.default = PullRequestIcon;