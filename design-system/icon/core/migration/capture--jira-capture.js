/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::3a308d01d7acc4a510f220c565667bf0>>
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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are in alpha - and subject to change or removal in future minor or patch releases.
 *
 * Migration Icon component for CaptureIcon.
 * This component is CaptureIcon, with `UNSAFE_fallbackIcon` set to "JiraCaptureIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CaptureIcon = props => /*#__PURE__*/_react.default.createElement(_capture.default, Object.assign({
  LEGACY_fallbackIcon: _capture2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CaptureIcon.Name = 'CaptureIconMigration';
var _default = exports.default = CaptureIcon;