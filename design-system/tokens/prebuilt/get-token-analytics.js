"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.recordTokenCall = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
// Extend the Window interface to include optional analyticsWebClient

/**
 * Records a token call event to the analytics service. This is used to track which tokens are being used at runtime as they should be substituted by the values by @atlaskit/tokens/babel-plugin at build time.
 * @param token - The token that was called.
 * @param fallback - The fallback value that was used.
 */
var recordTokenCall = exports.recordTokenCall = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(token, fallback) {
    var _window, analyticsClient, isThemeEnabled;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          try {
            // TODO: window.analyticsWebClient is a property specific to Jira. It is not available in the other products. We might consider to register a dedicated analytics client for logging token calls for each product to enable cohesive experience across different products.
            analyticsClient = (_window = window) === null || _window === void 0 ? void 0 : _window.analyticsWebClient;
            if (analyticsClient) {
              // Check for a <style> element with a data-theme attribute in the document
              isThemeEnabled = !!document.querySelector('style[data-theme]'); // when such property exists, we are using it to send this event https://data-portal.internal.atlassian.com/analytics/registry/75682 which is registered specifically for Jira.
              analyticsClient.sendEvent({
                type: 'TRACK',
                payload: {
                  action: 'called_at_runtime',
                  actionSubject: 'token',
                  source: 'design-system',
                  attributes: {
                    url: window.location.href,
                    token: token,
                    fallback: fallback,
                    isThemeEnabled: isThemeEnabled
                  }
                }
              });
            }
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
          }
        case 1:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function recordTokenCall(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();