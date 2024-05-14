"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = plugin;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var t = _interopRequireWildcard(require("@babel/types"));
var _tokenNames = _interopRequireDefault(require("../artifacts/token-names"));
var _atlassianLegacyLight = _interopRequireDefault(require("../artifacts/tokens-raw/atlassian-legacy-light"));
var _atlassianLight = _interopRequireDefault(require("../artifacts/tokens-raw/atlassian-light"));
var _atlassianShape = _interopRequireDefault(require("../artifacts/tokens-raw/atlassian-shape"));
var _atlassianSpacing = _interopRequireDefault(require("../artifacts/tokens-raw/atlassian-spacing"));
var _atlassianTypographyAdg = _interopRequireDefault(require("../artifacts/tokens-raw/atlassian-typography-adg3"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
// Convert raw tokens to key-value pairs { token: value }
var getThemeValues = function getThemeValues(theme) {
  return theme.reduce(function (formatted, rawToken) {
    var value;
    if (typeof rawToken.value === 'string') {
      value = rawToken.value;
    } else if (typeof rawToken.value === 'number') {
      value = rawToken.value.toString();
    } else {
      // If it's a box shadow, it'll be an array of values that needs to be
      // formatted to look like '0px 0px 8px #091e4229, 0px 0px 1px #091e421F'
      value = rawToken.value.reduce(function (prev, curr, index) {
        var color = curr.color;

        // Opacity needs to be added to hex values that don't already contain it.
        // If it contained opacity, the length would be 9 instead of 7.
        if (color.length === 7 && curr.opacity) {
          var opacityAsHex = curr.opacity.toString(16); // 0.4f5c28f5c28f5c
          var shortenedHex = opacityAsHex.slice(2, 4); // 4f

          // The hex value has to have a length of 2. If it's shorter, a "0" needs to be added.
          if (shortenedHex.length === 1) {
            shortenedHex += '0';
          }
          color += shortenedHex;
        }
        var value = "".concat(curr.offset.x, "px ").concat(curr.offset.y, "px ").concat(curr.radius, "px ").concat(color);
        if (index === 0) {
          value += ", ";
        }
        return prev + value;
      }, '');
    }
    return _objectSpread(_objectSpread({}, formatted), {}, (0, _defineProperty2.default)({}, rawToken.cleanName, value));
  }, {});
};
function plugin() {
  return {
    visitor: {
      Program: {
        enter: function enter(path, state) {
          // @ts-expect-error TS2339: Property 'file' does not exist on type 'Hub'
          var sourceFile = path.hub.file.opts.filename;
          if (sourceFile && sourceFile.includes('node_modules')) {
            return;
          }
          path.traverse({
            CallExpression: function (_CallExpression) {
              function CallExpression(_x) {
                return _CallExpression.apply(this, arguments);
              }
              CallExpression.toString = function () {
                return _CallExpression.toString();
              };
              return CallExpression;
            }(function (path) {
              var tokenImportScope = getTokenImportScope(path);
              if (!tokenImportScope) {
                return;
              }

              // Check arguments have correct format
              if (!path.node.arguments[0]) {
                throw new Error("token() requires at least one argument");
              } else if (!t.isStringLiteral(path.node.arguments[0])) {
                throw new Error("token() must have a string as the first argument");
              } else if (path.node.arguments.length > 2) {
                throw new Error("token() does not accept ".concat(path.node.arguments.length, " arguments"));
              }

              // Check the token exists
              var tokenName = path.node.arguments[0].value;
              var cssTokenValue = _tokenNames.default[tokenName];
              if (!cssTokenValue) {
                throw new Error("token '".concat(tokenName, "' does not exist"));
              }
              var replacementNode;

              // if no fallback is set, optionally find one from the default theme
              if (path.node.arguments.length < 2) {
                if (state.opts.shouldUseAutoFallback) {
                  replacementNode = t.stringLiteral("var(".concat(cssTokenValue, ", ").concat(getDefaultFallback(tokenName, state.opts.defaultTheme), ")"));
                } else {
                  replacementNode = t.stringLiteral("var(".concat(cssTokenValue, ")"));
                }
              }

              // Handle fallbacks
              var fallback = path.node.arguments[1];
              if (t.isStringLiteral(fallback)) {
                // String literals can be concatenated into css variable call
                // Empty string fallbacks are ignored. For now, as the user did specify a fallback, no default is inserted
                replacementNode = t.stringLiteral(fallback.value ? "var(".concat(cssTokenValue, ", ").concat(fallback.value, ")") : "var(".concat(cssTokenValue, ")"));
              } else if (t.isExpression(fallback)) {
                // Expressions should be placed in a template string/literal
                replacementNode = t.templateLiteral([t.templateElement({
                  cooked: "var(".concat(cssTokenValue, ", "),
                  // Currently we create a "raw" value by inserting escape characters via regex (https://github.com/babel/babel/issues/9242)
                  raw: "var(".concat(cssTokenValue.replace(/\\|`|\${/g, '\\$&'), ", ")
                }, false), t.templateElement({
                  raw: ')',
                  cooked: ')'
                }, true)], [fallback]);
              }

              // Replace path and call scope.crawl() to refresh the scope bindings + references
              replacementNode && path.replaceWith(replacementNode);
              // @ts-ignore crawl is a valid property
              tokenImportScope.crawl();
            })
          });
        },
        exit: function exit(path) {
          path.traverse({
            ImportDeclaration: function ImportDeclaration(path) {
              // remove import of 'token'
              if (path.node.source.value !== '@atlaskit/tokens') {
                return;
              }
              path.get('specifiers').forEach(function (specifier) {
                if (!specifier.isImportSpecifier()) {
                  return;
                }
                if (getNonAliasedImportName(specifier.node) !== 'token') {
                  return;
                }
                var binding = path.scope.bindings[getAliasedImportName(specifier.node)];

                // if no longer used, remove
                if (!binding.referenced) {
                  specifier.remove();
                }
              });

              // remove '@atlaskit/tokens' import if it is no longer needed
              if (path.get('specifiers').length === 0) {
                path.remove();
              }
            }
          });
        }
      }
    }
  };
}
var lightValues = getThemeValues(_atlassianLight.default);
var legacyLightValues = getThemeValues(_atlassianLegacyLight.default);
var shapeValues = getThemeValues(_atlassianShape.default);
var spacingValues = getThemeValues(_atlassianSpacing.default);
var typographyValues = getThemeValues(_atlassianTypographyAdg.default);
function getDefaultFallback(tokenName) {
  var theme = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'light';
  if (shapeValues[tokenName]) {
    return shapeValues[tokenName];
  }
  if (spacingValues[tokenName]) {
    return spacingValues[tokenName];
  }
  if (typographyValues[tokenName]) {
    return typographyValues[tokenName];
  }
  var colorValues = theme === 'legacy-light' ? legacyLightValues : lightValues;
  return colorValues[tokenName];
}
function getNonAliasedImportName(node) {
  if (t.isIdentifier(node.imported)) {
    return node.imported.name;
  }
  return node.imported.value;
}
function getAliasedImportName(node) {
  return node.local.name;
}

/**
 * Determine if the current call is to a token function, and
 * return the relevant scope
 */
function getTokenImportScope(path) {
  var callee = path.node.callee;
  if (!t.isIdentifier(callee)) {
    return undefined;
  }
  var binding = getTokenBinding(path.scope, callee.name);
  if (!binding || !t.isImportSpecifier(binding.path.node)) {
    return undefined;
  }
  if (binding.path.parent && t.isImportDeclaration(binding.path.parent)) {
    if (binding.path.parent.source.value !== '@atlaskit/tokens') {
      return undefined;
    }
  }
  return getNonAliasedImportName(binding.path.node) === 'token' ? binding.scope : undefined;
}
function getTokenBinding(scope, name) {
  if (!scope) {
    return undefined;
  }
  if (scope.bindings[name]) {
    return scope.bindings[name];
  } else {
    return getTokenBinding(scope.parent, name);
  }
}