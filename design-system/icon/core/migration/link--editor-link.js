"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _link = _interopRequireDefault(require("@atlaskit/icon/core/link"));
var _link2 = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/link"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * ⚠️ EXPERIMENTAL ⚠️ - New icons are a work in progress and subject to change or removal in future minor or patch releases.
 * Please reach out in #help-design-system before using these in production.
 *
 * Migration Icon component for LinkIcon.
 * This component is LinkIcon, with `UNSAFE_fallbackIcon` set to "EditorLinkIcon".
 *
 * Category: Single-purpose
 * Location: ADS
 * Usage guidance: Reserved for links, urls, or copy link.
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
const LinkIcon = props => /*#__PURE__*/_react.default.createElement(_link.default, Object.assign({
  LEGACY_fallbackIcon: _link2.default
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
}, props));
LinkIcon.Name = 'LinkIconMigration';
var _default = exports.default = LinkIcon;