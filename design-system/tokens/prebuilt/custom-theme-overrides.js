"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CUSTOM_THEME_SCOPE_ATTRIBUTE = void 0;
exports.getThemeAndOverrides = getThemeAndOverrides;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
/**
 * Inputs for the dynamic colour themes. Every colour token is derived from these two colours.
 */

/**
 * Optional unitless multipliers for individual heading sizes, applied on top of `dynamicFontScale`.
 * Each defaults to `1`, e.g. `dynamicFontHeadingXxlargeScale: 1.5` makes only `xxlarge` headings
 * larger.
 */

/**
 * The variable contract for custom themes that support runtime overrides.
 *
 * Add a theme here when it is introduced. Its theme dimensions and required override values are
 * then shared by TypeScript consumers.
 */

/**
 * A theme configuration that can provide typed overrides alongside a custom theme ID.
 *
 * @example
 * ```tsx
 * <AppProvider defaultTheme={{
 * 		light: {
 * 			id: 'UNSAFE-dynamic',
 * 			overrides: { dynamicForeground: '#172b4d', dynamicBackground: '#ffffff' },
 * 		},
 * 		dark: {
 * 			id: 'UNSAFE-dynamic-dark',
 * 			overrides: { dynamicForeground: '#ffffff', dynamicBackground: '#1d2125' },
 * 		},
 * 	}}
 * />
 * ```
 */

/**
 * Custom CSS variable overrides grouped by the theme dimension and theme ID they apply to.
 */

function isThemeWithOverrides(value) {
  return (0, _typeof2.default)(value) === 'object' && value !== null && 'id' in value && 'overrides' in value && typeof value.id === 'string' && (0, _typeof2.default)(value.overrides) === 'object' && value.overrides !== null;
}

/**
 * Marks a subtree theme element with its provider's scope, so its override styles only match that
 * element.
 */
var CUSTOM_THEME_SCOPE_ATTRIBUTE = exports.CUSTOM_THEME_SCOPE_ATTRIBUTE = 'data-theme-overrides-scope';

/**
 * Separates custom theme override values from the plain theme IDs consumed by the theme runtime.
 *
 * Pass a `scope` for subtree themes. The override selector then only matches the element carrying
 * `CUSTOM_THEME_SCOPE_ATTRIBUTE` with that value, so sibling subtrees using the same custom theme
 * with different values don't overwrite each other. Without a scope, the styles target `html` and
 * any subtree using the theme.
 */
function getThemeAndOverrides(themeWithOverrides, scope) {
  var theme = {};
  var overrides = {};
  for (var _i = 0, _Object$entries = Object.entries(themeWithOverrides || {}); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = (0, _slicedToArray2.default)(_Object$entries[_i], 2),
      themeKind = _Object$entries$_i[0],
      value = _Object$entries$_i[1];
    if (isThemeWithOverrides(value)) {
      theme[themeKind] = value.id;
      overrides[themeKind] = (0, _defineProperty2.default)({}, value.id, value.overrides);
      continue;
    }
    theme[themeKind] = value;
  }
  return {
    theme: theme,
    inlineStyles: getCustomThemeOverrideStyles(overrides, scope)
  };
}

/**
 * Escapes a value for use inside a double-quoted CSS attribute selector.
 */
function escapeAttributeValue(value) {
  return value.replace(/["\\]/g, '\\$&');
}
function getThemeOverrideSelector(themeKind, themeName, scope) {
  // Colour themes only apply in their own colour mode.
  var colorMode = themeKind === 'light' || themeKind === 'dark' ? "[data-color-mode=\"".concat(themeKind, "\"]") : '';
  var theme = "".concat(colorMode, "[data-theme~=\"").concat(themeKind, ":").concat(themeName, "\"]");
  if (scope) {
    return "[data-subtree-theme][".concat(CUSTOM_THEME_SCOPE_ATTRIBUTE, "=\"").concat(escapeAttributeValue(scope), "\"]").concat(theme);
  }
  return "html".concat(theme, ", [data-subtree-theme]").concat(theme);
}
function getCssVariableName(propertyName) {
  return "--ds-".concat(propertyName.replace(/([A-Z])/g, '-$1').toLowerCase());
}

/**
 * Generates CSS for custom theme overrides.
 *
 * Override property names are converted from camel case to `--ds-` CSS custom properties.
 */
function getCustomThemeOverrideStyles(overrides, scope) {
  if (!overrides) {
    return '';
  }
  return Object.entries(overrides).flatMap(function (_ref) {
    var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
      themeKind = _ref2[0],
      themes = _ref2[1];
    return Object.entries(themes || {}).flatMap(function (_ref3) {
      var _ref4 = (0, _slicedToArray2.default)(_ref3, 2),
        themeName = _ref4[0],
        values = _ref4[1];
      var styles = Object.entries(values || {})
      // Unset optional inputs are skipped so the theme's `var()` fallback applies. Writing
      // `undefined` would be a valid custom property value that breaks the formula.
      .filter(function (_ref5) {
        var _ref6 = (0, _slicedToArray2.default)(_ref5, 2),
          value = _ref6[1];
        return value !== undefined && value !== null;
      }).map(function (_ref7) {
        var _ref8 = (0, _slicedToArray2.default)(_ref7, 2),
          propertyName = _ref8[0],
          value = _ref8[1];
        return "".concat(getCssVariableName(propertyName), ": ").concat(value, ";");
      }).join('');
      return styles ? "\n\t\t".concat(getThemeOverrideSelector(themeKind, themeName, scope), " {\n\t\t\t").concat(styles, "\n\t\t}\n\t") : [];
    });
  }).join('');
}