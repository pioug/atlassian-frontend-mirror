/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::69e4d44e29533e2507d8eee189f4b936>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _baseNew = _interopRequireDefault(require("@atlaskit/icon/base-new"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Icon: "Timeline".
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for timelines in Jira or Trello.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const TimelineIcon = props => /*#__PURE__*/_react.default.createElement(_baseNew.default, Object.assign({
  name: "TimelineIcon",
  dangerouslySetGlyph: `<path fill="currentcolor" fill-rule="evenodd" d="M11 2.5H1V1h10zm4 4.167H5v-1.5h10zm-4 4.167H1v-1.5h10zM15 15H5v-1.5h10z" clip-rule="evenodd"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
TimelineIcon.displayName = 'TimelineIcon';
var _default = exports.default = TimelineIcon;