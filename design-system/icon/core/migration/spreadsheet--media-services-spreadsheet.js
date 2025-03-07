/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::f307268415d521d82d80e85337f4b08f>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _spreadsheet = _interopRequireDefault(require("@atlaskit/icon/core/spreadsheet"));
var _spreadsheet2 = _interopRequireDefault(require("@atlaskit/icon/glyph/media-services/spreadsheet"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for SpreadsheetIcon.
 * This component is SpreadsheetIcon, with `UNSAFE_fallbackIcon` set to "MediaServicesSpreadsheetIcon".
 *
 * Category: single-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Single purpose - Reserved for spreadsheets.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const SpreadsheetIcon = props => /*#__PURE__*/_react.default.createElement(_spreadsheet.default, Object.assign({
  LEGACY_fallbackIcon: _spreadsheet2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
SpreadsheetIcon.Name = 'SpreadsheetIconMigration';
var _default = exports.default = SpreadsheetIcon;