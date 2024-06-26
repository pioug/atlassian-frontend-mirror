"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _commit = _interopRequireDefault(require("@atlaskit/icon/core/commit"));
var _commits = _interopRequireDefault(require("@atlaskit/icon/glyph/bitbucket/commits"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for CommitIcon.
 * This component is CommitIcon, with `UNSAFE_fallbackIcon` set to "BitbucketCommitsIcon".
 *
 * Category: Single-purpose
 * Location: Icon contributions
 * Usage guidance: Reserved for commits in Jira or Bitbucket.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CommitIcon = props => /*#__PURE__*/_react.default.createElement(_commit.default, Object.assign({
  LEGACY_fallbackIcon: _commits.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CommitIcon.Name = 'CommitIconMigration';
var _default = exports.default = CommitIcon;