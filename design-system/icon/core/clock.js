/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::f9c38bfa054ce139eb4eb1d828621cdf>>
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
 * Icon: "Clock".
 * Category: multi-purpose
 * Location: @atlaskit/icon/core/clock
 * Usage guidance:
 * Known uses: recent, time input, sprint time remaining, overdue task work type status.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const ClockIcon = props => /*#__PURE__*/_react.default.createElement(_iconNew.default, Object.assign({
  name: "ClockIcon",
  dangerouslySetGlyph: `<path fill="currentcolor" d="M14.5 8a6.5 6.5 0 1 0-13 0 6.5 6.5 0 0 0 13 0M8.75 3.25v4.389l2.219 1.775-.938 1.172-2.5-2-.281-.226V3.25zM16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0"/>`
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
ClockIcon.displayName = 'ClockIcon';
var _default = exports.default = ClockIcon;