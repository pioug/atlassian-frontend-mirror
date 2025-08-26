/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::579d8b633629849a24e0bfd42e18cded>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _bug = _interopRequireDefault(require("@atlaskit/icon/core/bug"));
var _testSession = _interopRequireDefault(require("@atlaskit/icon/glyph/jira/test-session"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for BugIcon.
 * This component is BugIcon, with `UNSAFE_fallbackIcon` set to "JiraTestSessionIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: Request types in JSM, bugs in Jira.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const BugIcon = props => /*#__PURE__*/_react.default.createElement(_bug.default, Object.assign({
  name: "BugIcon",
  LEGACY_fallbackIcon: _testSession.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
BugIcon.displayName = 'BugIconMigration';
var _default = exports.default = BugIcon;