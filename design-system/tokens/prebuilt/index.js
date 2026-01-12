"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "COLOR_MODE_ATTRIBUTE", {
  enumerable: true,
  get: function get() {
    return _constants.COLOR_MODE_ATTRIBUTE;
  }
});
Object.defineProperty(exports, "CURRENT_SURFACE_CSS_VAR", {
  enumerable: true,
  get: function get() {
    return _constants.CURRENT_SURFACE_CSS_VAR;
  }
});
Object.defineProperty(exports, "SUBTREE_THEME_ATTRIBUTE", {
  enumerable: true,
  get: function get() {
    return _constants.SUBTREE_THEME_ATTRIBUTE;
  }
});
Object.defineProperty(exports, "THEME_DATA_ATTRIBUTE", {
  enumerable: true,
  get: function get() {
    return _constants.THEME_DATA_ATTRIBUTE;
  }
});
Object.defineProperty(exports, "ThemeMutationObserver", {
  enumerable: true,
  get: function get() {
    return _themeMutationObserver.default;
  }
});
Object.defineProperty(exports, "enableGlobalTheme", {
  enumerable: true,
  get: function get() {
    return _enableGlobalTheme.default;
  }
});
Object.defineProperty(exports, "getGlobalTheme", {
  enumerable: true,
  get: function get() {
    return _getGlobalTheme.default;
  }
});
Object.defineProperty(exports, "getSSRAutoScript", {
  enumerable: true,
  get: function get() {
    return _getSsrAutoScript.default;
  }
});
Object.defineProperty(exports, "getThemeHtmlAttrs", {
  enumerable: true,
  get: function get() {
    return _getThemeHtmlAttrs.default;
  }
});
Object.defineProperty(exports, "getThemeStyles", {
  enumerable: true,
  get: function get() {
    return _getThemeStyles.default;
  }
});
Object.defineProperty(exports, "getTokenValue", {
  enumerable: true,
  get: function get() {
    return _getTokenValue.default;
  }
});
Object.defineProperty(exports, "setGlobalTheme", {
  enumerable: true,
  get: function get() {
    return _setGlobalTheme.default;
  }
});
Object.defineProperty(exports, "themeConfig", {
  enumerable: true,
  get: function get() {
    return _themeConfig.default;
  }
});
Object.defineProperty(exports, "themeImportMap", {
  enumerable: true,
  get: function get() {
    return _themeImportMap.default;
  }
});
Object.defineProperty(exports, "themeObjectToString", {
  enumerable: true,
  get: function get() {
    return _themeStateTransformer.themeObjectToString;
  }
});
Object.defineProperty(exports, "themeStateDefaults", {
  enumerable: true,
  get: function get() {
    return _themeConfig.themeStateDefaults;
  }
});
Object.defineProperty(exports, "themeStringToObject", {
  enumerable: true,
  get: function get() {
    return _themeStateTransformer.themeStringToObject;
  }
});
Object.defineProperty(exports, "token", {
  enumerable: true,
  get: function get() {
    return _getToken.default;
  }
});
Object.defineProperty(exports, "useThemeObserver", {
  enumerable: true,
  get: function get() {
    return _useThemeObserver.default;
  }
});
var _themeConfig = _interopRequireWildcard(require("./theme-config"));
var _getToken = _interopRequireDefault(require("./get-token"));
var _getTokenValue = _interopRequireDefault(require("./get-token-value"));
var _setGlobalTheme = _interopRequireDefault(require("./set-global-theme"));
var _enableGlobalTheme = _interopRequireDefault(require("./enable-global-theme"));
var _getThemeStyles = _interopRequireDefault(require("./get-theme-styles"));
var _getThemeHtmlAttrs = _interopRequireDefault(require("./get-theme-html-attrs"));
var _getSsrAutoScript = _interopRequireDefault(require("./get-ssr-auto-script"));
var _useThemeObserver = _interopRequireDefault(require("./use-theme-observer"));
var _themeMutationObserver = _interopRequireDefault(require("./theme-mutation-observer"));
var _getGlobalTheme = _interopRequireDefault(require("./get-global-theme"));
var _themeStateTransformer = require("./theme-state-transformer");
var _themeImportMap = _interopRequireDefault(require("./artifacts/theme-import-map"));
var _constants = require("./constants");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }