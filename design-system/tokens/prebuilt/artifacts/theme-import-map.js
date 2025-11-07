"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != (0, _typeof2.default)(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * This file contains a dynamic import for each theme this package exports.
 * Themes are loaded asynchronously at runtime to minimise the amount of CSS we send to the client.
 * This allows users to compose their themes and only use the tokens that are requested.
 * When a new theme is created, the import should automatically be added to the map
 *
 * @codegen <<SignedSource::9191189f78aa08332c0debbe868dc103>>
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
  'typography': function typography() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require( /* webpackChunkName: "@atlaskit-internal_atlassian-typography" */
      './themes/atlassian-typography'));
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
  }
};
var _default = exports.default = themeImportsMap;