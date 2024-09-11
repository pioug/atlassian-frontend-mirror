"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != (0, _typeof2.default)(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * This file contains a dynamic import for each theme this package exports.
 * Themes are loaded asynchronously at runtime to minimise the amount of CSS we send to the client.
 * This allows users to compose their themes and only use the tokens that are requested.
 * When a new theme is created, the import should automatically be added to the map
 *
 * @codegen <<SignedSource::8352f41e09dfe9d45ead708661744456>>
 * @codegenCommand yarn build tokens
 */

var themeImportsMap = {
  'light': function light() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require( /* webpackChunkName: "@atlaskit-internal_atlassian-light" */
      './themes/atlassian-light'));
    });
  },
  'light-future': function lightFuture() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require( /* webpackChunkName: "@atlaskit-internal_atlassian-light-future" */
      './themes/atlassian-light-future'));
    });
  },
  'light-increased-contrast': function lightIncreasedContrast() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require( /* webpackChunkName: "@atlaskit-internal_atlassian-light-increased-contrast" */
      './themes/atlassian-light-increased-contrast'));
    });
  },
  'dark': function dark() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require( /* webpackChunkName: "@atlaskit-internal_atlassian-dark" */
      './themes/atlassian-dark'));
    });
  },
  'dark-future': function darkFuture() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require( /* webpackChunkName: "@atlaskit-internal_atlassian-dark-future" */
      './themes/atlassian-dark-future'));
    });
  },
  'dark-increased-contrast': function darkIncreasedContrast() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require( /* webpackChunkName: "@atlaskit-internal_atlassian-dark-increased-contrast" */
      './themes/atlassian-dark-increased-contrast'));
    });
  },
  'legacy-light': function legacyLight() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require( /* webpackChunkName: "@atlaskit-internal_atlassian-legacy-light" */
      './themes/atlassian-legacy-light'));
    });
  },
  'legacy-dark': function legacyDark() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require( /* webpackChunkName: "@atlaskit-internal_atlassian-legacy-dark" */
      './themes/atlassian-legacy-dark'));
    });
  },
  'spacing': function spacing() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require( /* webpackChunkName: "@atlaskit-internal_atlassian-spacing" */
      './themes/atlassian-spacing'));
    });
  },
  'typography-adg3': function typographyAdg3() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require( /* webpackChunkName: "@atlaskit-internal_atlassian-typography-adg3" */
      './themes/atlassian-typography-adg3'));
    });
  },
  'shape': function shape() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require( /* webpackChunkName: "@atlaskit-internal_atlassian-shape" */
      './themes/atlassian-shape'));
    });
  },
  'typography-modernized': function typographyModernized() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require( /* webpackChunkName: "@atlaskit-internal_atlassian-typography-modernized" */
      './themes/atlassian-typography-modernized'));
    });
  },
  'typography-refreshed': function typographyRefreshed() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require( /* webpackChunkName: "@atlaskit-internal_atlassian-typography-refreshed" */
      './themes/atlassian-typography-refreshed'));
    });
  },
  'light-brand-refresh': function lightBrandRefresh() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require( /* webpackChunkName: "@atlaskit-internal_atlassian-light-brand-refresh" */
      './themes/atlassian-light-brand-refresh'));
    });
  },
  'dark-brand-refresh': function darkBrandRefresh() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require( /* webpackChunkName: "@atlaskit-internal_atlassian-dark-brand-refresh" */
      './themes/atlassian-dark-brand-refresh'));
    });
  }
};
var _default = exports.default = themeImportsMap;