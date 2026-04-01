"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTokenUsageGuidelines = void 0;
var getTokenUsageGuidelines = exports.getTokenUsageGuidelines = function getTokenUsageGuidelines(tokenId) {
  var tokenTypes = Object.keys(usageMappings);
  var foundType = tokenTypes.find(function (type) {
    return tokenId.startsWith(type);
  });
  if (foundType && usageMappings[foundType]) {
    return usageMappings[foundType];
  }
  return {
    usage: '',
    cssProperties: []
  }; // Fallback if tokenId doesn't match any token type
};
var usageMappings = {
  'color.text': {
    usage: 'The color for standard text. Use for primary, readable text in most user interface situations (e.g. color.text, color.text.subtle)',
    cssProperties: ['color']
  },
  'color.link': {
    usage: 'The color for hyperlinks. Use for elements that are links to external resources or navigation (e.g. color.link)',
    cssProperties: ['color']
  },
  'color.icon': {
    usage: 'The color for icons. Use for graphical icon elements (e.g. color.icon.brand)',
    cssProperties: ['color', 'fill', 'stroke']
  },
  'color.border': {
    usage: 'The color for borders or outlines. Use for border and outline colors on components (e.g. color.border, color.border.focused)',
    cssProperties: ['border-color', 'outline-color']
  },
  'color.background': {
    usage: 'The color for backgrounds. Use for areas behind content (e.g. color.background.neutral, color.background.selected)',
    cssProperties: ['background-color']
  },
  'color.blanket': {
    usage: 'The color for overlay "blankets" such as modals/dimmers/overlays (e.g. color.blanket)',
    cssProperties: ['background-color']
  },
  'color.interaction': {
    usage: 'Transparent interaction states for use over elements when their background color cannot change, such as images and avatars.',
    cssProperties: ['background-color', 'border-color']
  },
  'color.skeleton': {
    usage: 'The color for skeleton/loading placeholders (e.g. color.skeleton)',
    cssProperties: ['background-color']
  },
  'color.chart': {
    usage: 'The color for chart and data visualization elements (e.g. color.chart)',
    cssProperties: ['fill', 'stroke', 'background-color', 'color']
  },
  'elevation.surface': {
    usage: 'The base color for app and component surfaces. Raised and overlay surfaces should be used in concert with shadows (e.g. elevation.surface.raised should be used with elevation.shadow.raised)',
    cssProperties: ['background-color']
  },
  'elevation.shadow': {
    usage: 'Shadows for showing depth and elevation (e.g. elevation.shadow.raised, elevation.shadow.overlay). Use via the box-shadow property to indicate layer hierarchy',
    cssProperties: ['box-shadow']
  },
  opacity: {
    usage: 'Controls the transparency of an element (e.g. opacity.disabled, opacity.loading). Used for communication of loading and disabled states',
    cssProperties: ['opacity']
  },
  utility: {
    usage: 'Code-specific tokens to aid with migration or enable features such as automatic elevation detection',
    cssProperties: []
  },
  space: {
    usage: 'Spacing tokens define the distance, alignment, and layout positioning (e.g. space.100, space.200, space.050). Use for margin, padding, gap, and layout positioning such as top, left, etc',
    cssProperties: ['padding', 'margin', 'gap', 'top', 'left', 'right', 'bottom', 'inset']
  },
  'font.heading': {
    usage: 'A composite token that applies complete font-related properties for headings (e.g. font.heading.xlarge). Includes font size, weight, line height, and family',
    cssProperties: ['font']
  },
  'font.body': {
    usage: 'A composite token that applies all font properties for standard body text (e.g. font.body)',
    cssProperties: ['font']
  },
  'font.metric': {
    usage: 'Font settings for displaying numbers or metrics, ensuring legibility and alignment (e.g. font.metric)',
    cssProperties: ['font']
  },
  'font.code': {
    usage: 'Font settings for inline code and code blocks, enforcing monospace font and sizing (e.g. font.code)',
    cssProperties: ['font', 'font-family', 'font-size', 'font-weight', 'line-height']
  },
  'font.weight': {
    usage: 'Granular control of font weight (e.g. font.weight.regular, font.weight.semibold). Use only to override the default font tokens for custom typography components beyond what’s supported by Text, MetricText and Heading',
    cssProperties: ['font-weight']
  },
  'font.family': {
    usage: 'Granular control of font family (e.g. font.family.body). Use only when overriding the default in composites',
    cssProperties: ['font-family']
  },
  'font.lineHeight': {
    usage: 'Granular control of font line height (e.g. font.lineHeight.100). Use only when overriding the default in composites',
    cssProperties: ['line-height']
  },
  radius: {
    usage: 'Controls the rounding of element corners, often for containers (e.g. radius.medium, radius.circle)',
    cssProperties: ['border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius']
  },
  'border.width': {
    usage: 'Controls the thickness of borders/dividers (e.g. border.width, border.width.selected). Use to standardize border widths throughout UI',
    cssProperties: ['border-width']
  }
};

/**
 * Types of tokens. Using path.subpath notation.
 */