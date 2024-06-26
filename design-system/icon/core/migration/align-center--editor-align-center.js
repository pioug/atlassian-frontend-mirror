"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _alignCenter = _interopRequireDefault(require("@atlaskit/icon/core/align-center"));
var _alignCenter2 = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/align-center"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for AlignCenterIcon.
 * This component is AlignCenterIcon, with `UNSAFE_fallbackIcon` set to "EditorAlignCenterIcon".
 *
 * Category: Multi-purpose
 * Location: Icon contributions
 * Usage guidance: Known uses: align text center, align center.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const AlignCenterIcon = props => /*#__PURE__*/_react.default.createElement(_alignCenter.default, Object.assign({
  LEGACY_fallbackIcon: _alignCenter2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
AlignCenterIcon.Name = 'AlignCenterIconMigration';
var _default = exports.default = AlignCenterIcon;