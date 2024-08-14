/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::8b508bb8b2327defba5dd6f87c598833>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _branch = _interopRequireDefault(require("@atlaskit/icon/core/branch"));
var _branches = _interopRequireDefault(require("@atlaskit/icon/glyph/bitbucket/branches"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for BranchIcon.
 * This component is BranchIcon, with `UNSAFE_fallbackIcon` set to "BitbucketBranchesIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for branches in Bitbucket and Jira
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const BranchIcon = props => /*#__PURE__*/_react.default.createElement(_branch.default, Object.assign({
  LEGACY_fallbackIcon: _branches.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
BranchIcon.Name = 'BranchIconMigration';
var _default = exports.default = BranchIcon;