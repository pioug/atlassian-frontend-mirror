"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::b5e0d1101d651ea4c6d0b99bac58727e>>
 * @codegenCommand yarn build tokens
 */

var tokens = [{
  "attributes": {
    "group": "paint",
    "state": "active",
    "introduced": "0.6.0",
    "description": "Hovered state for color.background.neutral.subtle"
  },
  "value": "#BDBDBD0A",
  "filePath": "schema/themes/atlassian-dark-finesse/color/background.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "paint",
      "state": "active",
      "introduced": "0.6.0",
      "description": "Hovered state for color.background.neutral.subtle"
    },
    "value": "DarkNeutral100A"
  },
  "name": "color.background.neutral.subtle.hovered",
  "path": ["color", "background", "neutral", "subtle", "hovered"],
  "cleanName": "color.background.neutral.subtle.hovered"
}, {
  "attributes": {
    "group": "paint",
    "state": "active",
    "introduced": "0.6.0",
    "description": "Pressed state for color.background.neutral.subtle"
  },
  "value": "#CECED912",
  "filePath": "schema/themes/atlassian-dark-finesse/color/background.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "paint",
      "state": "active",
      "introduced": "0.6.0",
      "description": "Pressed state for color.background.neutral.subtle"
    },
    "value": "DarkNeutral200A"
  },
  "name": "color.background.neutral.subtle.pressed",
  "path": ["color", "background", "neutral", "subtle", "pressed"],
  "cleanName": "color.background.neutral.subtle.pressed"
}, {
  "attributes": {
    "group": "paint",
    "state": "active",
    "introduced": "0.6.2",
    "description": "Use for the background of an element that communicates selection, such as a selected navigation item, or the opened state of a dropdown trigger. Use color.background.selected.hovered or color.background.selected.pressed when interacting with a selected element. Selection is distinct from keyboard focus and hover alone."
  },
  "value": "#CECED912",
  "filePath": "schema/themes/atlassian-dark-finesse/color/background.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "paint",
      "state": "active",
      "introduced": "0.6.2",
      "description": "Use for the background of an element that communicates selection, such as a selected navigation item, or the opened state of a dropdown trigger. Use color.background.selected.hovered or color.background.selected.pressed when interacting with a selected element. Selection is distinct from keyboard focus and hover alone."
    },
    "value": "DarkNeutral200A"
  },
  "name": "color.background.selected.[default].[default]",
  "path": ["color", "background", "selected", "[default]", "[default]"],
  "cleanName": "color.background.selected"
}, {
  "attributes": {
    "group": "paint",
    "state": "active",
    "introduced": "0.6.2",
    "description": "Use for the background of an element that is selected and hovered. This preserves selection while showing pointer hover; do not use for an unselected element or keyboard focus alone."
  },
  "value": "#E3E4F21F",
  "filePath": "schema/themes/atlassian-dark-finesse/color/background.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "paint",
      "state": "active",
      "introduced": "0.6.2",
      "description": "Use for the background of an element that is selected and hovered. This preserves selection while showing pointer hover; do not use for an unselected element or keyboard focus alone."
    },
    "value": "DarkNeutral300A"
  },
  "name": "color.background.selected.[default].hovered",
  "path": ["color", "background", "selected", "[default]", "hovered"],
  "cleanName": "color.background.selected.hovered"
}, {
  "attributes": {
    "group": "paint",
    "state": "active",
    "introduced": "0.6.2",
    "description": "Use for the background of an element that is selected and being pressed. Return to color.background.selected or color.background.selected.hovered when the press ends and the element remains selected. Do not use for an unselected element or keyboard focus alone."
  },
  "value": "#E5E9F640",
  "filePath": "schema/themes/atlassian-dark-finesse/color/background.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "paint",
      "state": "active",
      "introduced": "0.6.2",
      "description": "Use for the background of an element that is selected and being pressed. Return to color.background.selected or color.background.selected.hovered when the press ends and the element remains selected. Do not use for an unselected element or keyboard focus alone."
    },
    "value": "DarkNeutral400A"
  },
  "name": "color.background.selected.[default].pressed",
  "path": ["color", "background", "selected", "[default]", "pressed"],
  "cleanName": "color.background.selected.pressed"
}, {
  "attributes": {
    "group": "paint",
    "state": "active",
    "introduced": "0.6.2",
    "description": "Use for the bold background of selected controls, such as checked checkboxes and selected radio buttons. Pair with color.text.inverse or color.icon.inverse for foreground content. Do not use for primary actions or keyboard focus alone."
  },
  "value": "#CECFD2",
  "filePath": "schema/themes/atlassian-dark-finesse/color/background.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "paint",
      "state": "active",
      "introduced": "0.6.2",
      "description": "Use for the bold background of selected controls, such as checked checkboxes and selected radio buttons. Pair with color.text.inverse or color.icon.inverse for foreground content. Do not use for primary actions or keyboard focus alone."
    },
    "value": "DarkNeutral1000"
  },
  "name": "color.background.selected.bold.[default]",
  "path": ["color", "background", "selected", "bold", "[default]"],
  "cleanName": "color.background.selected.bold"
}, {
  "attributes": {
    "group": "paint",
    "state": "active",
    "introduced": "0.6.2",
    "description": "Use for the background of a selected control that uses color.background.selected.bold while it is hovered, such as a checked checkbox. Pair with color.text.inverse or color.icon.inverse for foreground content. Do not use for an unselected control or keyboard focus alone."
  },
  "value": "#BFC1C4",
  "filePath": "schema/themes/atlassian-dark-finesse/color/background.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "paint",
      "state": "active",
      "introduced": "0.6.2",
      "description": "Use for the background of a selected control that uses color.background.selected.bold while it is hovered, such as a checked checkbox. Pair with color.text.inverse or color.icon.inverse for foreground content. Do not use for an unselected control or keyboard focus alone."
    },
    "value": "DarkNeutral900"
  },
  "name": "color.background.selected.bold.hovered",
  "path": ["color", "background", "selected", "bold", "hovered"],
  "cleanName": "color.background.selected.bold.hovered"
}, {
  "attributes": {
    "group": "paint",
    "state": "active",
    "introduced": "0.6.2",
    "description": "Use for the background of a selected control that uses color.background.selected.bold while it is being pressed, such as a checked checkbox. Pair with color.text.inverse or color.icon.inverse for foreground content. Do not use for an unselected control or keyboard focus alone."
  },
  "value": "#A9ABAF",
  "filePath": "schema/themes/atlassian-dark-finesse/color/background.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "paint",
      "state": "active",
      "introduced": "0.6.2",
      "description": "Use for the background of a selected control that uses color.background.selected.bold while it is being pressed, such as a checked checkbox. Pair with color.text.inverse or color.icon.inverse for foreground content. Do not use for an unselected control or keyboard focus alone."
    },
    "value": "DarkNeutral800"
  },
  "name": "color.background.selected.bold.pressed",
  "path": ["color", "background", "selected", "bold", "pressed"],
  "cleanName": "color.background.selected.bold.pressed"
}, {
  "attributes": {
    "group": "paint",
    "state": "active",
    "introduced": "0.6.2",
    "description": "Use for borders or visual indicators that communicate selection, such as the active tab or a selected menu item, or the opened state of a dropdown trigger. Do not use as a keyboard focus indicator; use color.border.focused for focus and preserve the selected treatment when both states apply."
  },
  "value": "#CECFD2",
  "filePath": "schema/themes/atlassian-dark-finesse/color/border.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "paint",
      "state": "active",
      "introduced": "0.6.2",
      "description": "Use for borders or visual indicators that communicate selection, such as the active tab or a selected menu item, or the opened state of a dropdown trigger. Do not use as a keyboard focus indicator; use color.border.focused for focus and preserve the selected treatment when both states apply."
    },
    "value": "DarkNeutral1000"
  },
  "name": "color.border.selected",
  "path": ["color", "border", "selected"],
  "cleanName": "color.border.selected"
}, {
  "attributes": {
    "group": "paint",
    "state": "active",
    "introduced": "0.6.0",
    "description": "Use for text that communicates selection, such as the active tab or a selected navigation item, or the opened state of a dropdown trigger. On bold selected backgrounds, use color.text.inverse instead. Do not use for unselected links, brand emphasis, or hover alone. Keep the selected text treatment when the element also has focus."
  },
  "value": "#CECFD2",
  "filePath": "schema/themes/atlassian-dark-finesse/color/text.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "paint",
      "state": "active",
      "introduced": "0.6.0",
      "description": "Use for text that communicates selection, such as the active tab or a selected navigation item, or the opened state of a dropdown trigger. On bold selected backgrounds, use color.text.inverse instead. Do not use for unselected links, brand emphasis, or hover alone. Keep the selected text treatment when the element also has focus."
    },
    "value": "DarkNeutral1000"
  },
  "name": "color.text.selected",
  "path": ["color", "text", "selected"],
  "cleanName": "color.text.selected"
}, {
  "attributes": {
    "group": "paint",
    "state": "active",
    "introduced": "0.6.2",
    "description": "Use for icons that communicate selection, such as icons in selected navigation items, or the opened state of a dropdown trigger. On bold selected backgrounds, use color.icon.inverse instead. Do not use for brand emphasis or hover alone. Keep the selected icon treatment when the element also has focus."
  },
  "value": "#CECFD2",
  "filePath": "schema/themes/atlassian-dark-finesse/color/icon.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "paint",
      "state": "active",
      "introduced": "0.6.2",
      "description": "Use for icons that communicate selection, such as icons in selected navigation items, or the opened state of a dropdown trigger. On bold selected backgrounds, use color.icon.inverse instead. Do not use for brand emphasis or hover alone. Keep the selected icon treatment when the element also has focus."
    },
    "value": "DarkNeutral1000"
  },
  "name": "color.icon.selected",
  "path": ["color", "icon", "selected"],
  "cleanName": "color.icon.selected"
}, {
  "attributes": {
    "group": "paint",
    "state": "active",
    "introduced": "0.6.0",
    "description": "Use as a translucent blanket to communicate selection when changing the background of the selected content is not possible, such as selected Editor blocks. The content beneath remains visible. Do not use to indicate keyboard focus or hover alone."
  },
  "value": "#CECED912",
  "filePath": "schema/themes/atlassian-dark-finesse/color/background.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "paint",
      "state": "active",
      "introduced": "0.6.0",
      "description": "Use as a translucent blanket to communicate selection when changing the background of the selected content is not possible, such as selected Editor blocks. The content beneath remains visible. Do not use to indicate keyboard focus or hover alone."
    },
    "value": "DarkNeutral200A"
  },
  "name": "color.blanket.selected",
  "path": ["color", "blanket", "selected"],
  "cleanName": "color.blanket.selected"
}];
var _default = exports.default = tokens;