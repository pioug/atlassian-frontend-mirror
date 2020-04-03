"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var styled_components_1 = tslib_1.__importDefault(require("styled-components"));
var colors_1 = require("@atlaskit/theme/colors");
var sizes = {
    small: '16px',
    medium: '24px',
    large: '32px',
    xlarge: '48px',
};
exports.size = Object.keys(sizes).reduce(function (p, c) {
    var _a;
    return Object.assign(p, (_a = {}, _a[c] = c, _a));
}, {});
var getSize = function (props) {
    return props.size
        ? "height: " + sizes[props.size] + "; width: " + sizes[props.size] + ";"
        : null;
};
exports.IconWrapper = styled_components_1.default.span(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n  ", " color: ", ";\n  display: inline-block;\n  fill: ", ";\n  flex-shrink: 0;\n  line-height: 1;\n\n  > svg {\n    ", " max-height: 100%;\n    max-width: 100%;\n    overflow: hidden;\n    pointer-events: none;\n    vertical-align: bottom;\n  }\n  /* Stop-color doesn't properly apply in chrome when the inherited/current color changes.\n   * We have to initially set stop-color to inherit (either via DOM attribute or an initial CSS\n   * rule) and then override it with currentColor for the color changes to be picked up.\n   */\n  stop {\n    stop-color: currentColor;\n  }\n"], ["\n  ", " color: ", ";\n  display: inline-block;\n  fill: ", ";\n  flex-shrink: 0;\n  line-height: 1;\n\n  > svg {\n    ", " max-height: 100%;\n    max-width: 100%;\n    overflow: hidden;\n    pointer-events: none;\n    vertical-align: bottom;\n  }\n  /* Stop-color doesn't properly apply in chrome when the inherited/current color changes.\n   * We have to initially set stop-color to inherit (either via DOM attribute or an initial CSS\n   * rule) and then override it with currentColor for the color changes to be picked up.\n   */\n  stop {\n    stop-color: currentColor;\n  }\n"])), getSize, function (p) { return p.primaryColor || 'currentColor'; }, function (p) { return p.secondaryColor || colors_1.background; }, getSize);
var Icon = function (_a) {
    var dangerouslySetGlyph = _a.dangerouslySetGlyph, _b = _a.size, size = _b === void 0 ? 'medium' : _b, label = _a.label;
    return (react_1.default.createElement(exports.IconWrapper, { size: size, "aria-label": label, dangerouslySetInnerHTML: dangerouslySetGlyph
            ? {
                __html: dangerouslySetGlyph,
            }
            : undefined }));
};
exports.default = Icon;
var templateObject_1;
//# sourceMappingURL=Icon.js.map