"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var styled_components_1 = tslib_1.__importDefault(require("styled-components"));
var colors_1 = require("@atlaskit/theme/colors");
var sizes = {
    small: { height: '16px', width: '16px' },
    medium: { height: '24px', width: '24px' },
};
var getSize = function (props) {
    if (props.size) {
        return "height: " + sizes[props.size].height + "; width: " + sizes[props.size].width + ";";
    }
    return null;
};
exports.IconWrapper = styled_components_1.default.span(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n  ", " color: ", ";\n  display: inline-block;\n  fill: ", ";\n  flex-shrink: 0;\n  line-height: 1;\n\n  > svg {\n    ", " max-height: 100%;\n    max-width: 100%;\n    overflow: hidden;\n    pointer-events: none;\n    vertical-align: bottom;\n  }\n  /* Stop-color doesn't properly apply in chrome when the inherited/current color changes.\n   * We have to initially set stop-color to inherit (either via DOM attribute or an initial CSS\n   * rule) and then override it with currentColor for the color changes to be picked up.\n   */\n  stop {\n    stop-color: currentColor;\n  }\n"], ["\n  ", " color: ", ";\n  display: inline-block;\n  fill: ", ";\n  flex-shrink: 0;\n  line-height: 1;\n\n  > svg {\n    ", " max-height: 100%;\n    max-width: 100%;\n    overflow: hidden;\n    pointer-events: none;\n    vertical-align: bottom;\n  }\n  /* Stop-color doesn't properly apply in chrome when the inherited/current color changes.\n   * We have to initially set stop-color to inherit (either via DOM attribute or an initial CSS\n   * rule) and then override it with currentColor for the color changes to be picked up.\n   */\n  stop {\n    stop-color: currentColor;\n  }\n"])), getSize, function (p) { return p.primaryColor || 'currentColor'; }, function (p) { return p.secondaryColor || colors_1.background; }, getSize);
var Icon = /** @class */ (function (_super) {
    tslib_1.__extends(Icon, _super);
    function Icon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Icon.prototype.render = function () {
        var _a = this.props, dangerouslySetGlyph = _a.dangerouslySetGlyph, label = _a.label, size = _a.size;
        return (react_1.default.createElement(exports.IconWrapper, { size: size, "aria-label": label ? label : undefined, role: label ? 'img' : 'presentation', dangerouslySetInnerHTML: dangerouslySetGlyph
                ? {
                    __html: dangerouslySetGlyph,
                }
                : undefined }));
    };
    return Icon;
}(react_1.Component));
exports.default = Icon;
exports.size = Object.keys(sizes).reduce(function (p, c) {
    var _a;
    return Object.assign(p, (_a = {}, _a[c] = c, _a));
}, {});
var templateObject_1;
//# sourceMappingURL=Icon.js.map