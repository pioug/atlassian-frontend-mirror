/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::c340c12b63af1ce757ffa4f53a0717b1>>
 * @codegenCommand yarn build:icon-glyphs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _cloudArrowUp = _interopRequireDefault(require("@atlaskit/icon/core/cloud-arrow-up"));
var _upload = _interopRequireDefault(require("@atlaskit/icon/glyph/upload"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Migration Icon component for CloudArrowUpIcon.
 * This component is CloudArrowUpIcon, with `UNSAFE_fallbackIcon` set to "UploadIcon".
 *
 * Category: multi-purpose
 * Location: @atlaskit/icon
 * Usage guidance: Multi purpose - Known uses: deployments in Jira.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const CloudArrowUpIcon = props => /*#__PURE__*/_react.default.createElement(_cloudArrowUp.default, Object.assign({
  name: "CloudArrowUpIcon",
  LEGACY_fallbackIcon: _upload.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
CloudArrowUpIcon.displayName = 'CloudArrowUpIconMigration';
var _default = exports.default = CloudArrowUpIcon;