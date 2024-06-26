"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _spreadsheet = _interopRequireDefault(require("@atlaskit/icon/core/spreadsheet"));
var _spreadsheet2 = _interopRequireDefault(require("@atlaskit/icon/glyph/media-services/spreadsheet"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for SpreadsheetIcon.
 * This component is SpreadsheetIcon, with `UNSAFE_fallbackIcon` set to "MediaServicesSpreadsheetIcon".
 *
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for spreadsheets.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const SpreadsheetIcon = props => /*#__PURE__*/_react.default.createElement(_spreadsheet.default, Object.assign({
  LEGACY_fallbackIcon: _spreadsheet2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
SpreadsheetIcon.Name = 'SpreadsheetIconMigration';
var _default = exports.default = SpreadsheetIcon;