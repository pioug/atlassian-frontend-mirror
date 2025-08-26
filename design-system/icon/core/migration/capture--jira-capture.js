/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::84ab8f85180400fd7c3dec47d0a4c527>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _capture = _interopRequireDefault(require("@atlaskit/icon/core/capture"));
var _capture2 = _interopRequireDefault(require("@atlaskit/icon/glyph/jira/capture"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for CaptureIcon.
 * This component is CaptureIcon, with `UNSAFE_fallbackIcon` set to "JiraCaptureIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Reserved for representing Focus Areas.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CaptureIcon = props => /*#__PURE__*/_react.default.createElement(_capture.default, Object.assign({
  name: "CaptureIcon",
  LEGACY_fallbackIcon: _capture2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CaptureIcon.displayName = 'CaptureIconMigration';
var _default = exports.default = CaptureIcon;