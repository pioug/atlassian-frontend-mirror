/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::5b4043daf294edfb6e9fedbae382cffb>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _iconNew = _interopRequireDefault(require("@atlaskit/icon/components/icon-new"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Icon: "Commit".
 * Category: single-purpose
 * Location: @atlaskit/icon/core/commit
 * Usage guidance:
 * Single purpose - Reserved for commits in Jira or Bitbucket.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CommitIcon = props => /*#__PURE__*/_react.default.createElement(_iconNew.default, Object.assign({
  name: "CommitIcon",
  dangerouslySetGlyph: `<path fill="currentcolor" fill-rule="evenodd" d="M7.25 5.354a2.751 2.751 0 0 0 0 5.292V16h1.5v-5.353a2.751 2.751 0 0 0 0-5.293V0h-1.5zM8 6.75a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5" clip-rule="evenodd"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CommitIcon.displayName = 'CommitIcon';
var _default = exports.default = CommitIcon;