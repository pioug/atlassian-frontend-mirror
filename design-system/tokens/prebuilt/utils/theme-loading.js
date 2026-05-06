"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadAndAppendThemeCss = exports.darkModeMediaQuery = void 0;
Object.defineProperty(exports, "loadThemeCss", {
  enumerable: true,
  get: function get() {
    return _loadThemeCss.loadThemeCss;
  }
});
exports.moreContrastMediaQuery = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _constants = require("../constants");
var _loadThemeCss = require("./load-theme-css");
var loadAndAppendThemeCss = exports.loadAndAppendThemeCss = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(themeId) {
    var themeCss, style;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (!document.head.querySelector("style[".concat(_constants.THEME_DATA_ATTRIBUTE, "=\"").concat(themeId, "\"]:not([").concat(_constants.CUSTOM_THEME_ATTRIBUTE, "])"))) {
            _context.next = 2;
            break;
          }
          return _context.abrupt("return");
        case 2:
          if (themeId) {
            _context.next = 4;
            break;
          }
          return _context.abrupt("return");
        case 4:
          _context.next = 6;
          return (0, _loadThemeCss.loadThemeCss)(themeId);
        case 6:
          themeCss = _context.sent;
          style = document.createElement('style');
          style.textContent = themeCss;
          style.dataset.theme = themeId;
          document.head.appendChild(style);
        case 11:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function loadAndAppendThemeCss(_x) {
    return _ref.apply(this, arguments);
  };
}();
var darkModeMediaQuery = exports.darkModeMediaQuery = '(prefers-color-scheme: dark)';
var moreContrastMediaQuery = exports.moreContrastMediaQuery = '(prefers-contrast: more)';