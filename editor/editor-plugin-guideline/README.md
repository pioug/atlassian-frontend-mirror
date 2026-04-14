# Editor Plugin Guideline

Guideline plugin for @atlaskit/editor-core

## Overview

The Guideline plugin provides the ability to display vertical guidelines in the editor. Guidelines are rendered as vertical lines at specified positions and can be customized with different styles and states. This plugin was designed to contain only basic logic to render guidelines. Commonly used configurations and utilities reside in the `editor-common` package.

## Key features

- **Display guidelines** - Render vertical guidelines at specified positions within the editor
- **Flexible positioning** - Position guidelines using coordinate values relative to the editor center
- **Customizable styles** - Configure line style (solid/dashed), color, and cap style
- **State management** - Control visibility and active states of individual guidelines
- **Plugin integration** - Works with the width plugin to calculate correct positioning

## Install

```
yarn add @atlaskit/editor-plugin-guideline
```

- **npm** - [@atlaskit/editor-plugin-guideline](https://www.npmjs.com/package/@atlaskit/editor-plugin-guideline)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-guideline)

## Usage

### Basic Example

```typescript
pluginInjectionApi?.dependencies?.guideline?.actions?.displayGuideline(view)({
  guidelines: [{
    key: "guideline_01",
    position: {
      x: -100
    },
    active: true,
    style: "dashed",
    color: "rgba(0, 0, 0, 0.2)"
  }, 
  {
    key: "guideline_02",
    position: {
      x: 300
    },
    show: false
  }]
});
```

### Guideline Configuration

A guideline config consists of three parts:

- **Key** (required) - A unique identifier for the guideline
- **Position** (required) - The x-coordinate position of the guideline
- **State/Style** (optional) - Display state and styling options

### Position

The position value is defined as: `type Position = { x: number };`

Position diagram:

```
  │                   editor width                    │
  │------------------- max 1800px --------------------│
  │                                                   │
  │          center line (when position x=0)          │
  │                         │                         │
  │--------- x < 0 ---------│--------- x > 0 ---------│
  │                         │                         │
  ┌────────────┬────────────┬────────────┬────────────┐
  │            │            │            │            │
  │            │            │            │            │
  │            │            │            │            │
  │            │-- 380px ---│--- 380px --│            │
  │            │            │            │            │
  │            │            │            │            │
  │            │            │            │            │
  └────────────┴────────────┴────────────┴────────────┘
               │      editor content     │
               │-------- max 760px ------│
  │---------- or 1800px in full-width mode  ----------│
```

- When `x` is 0, a vertical line is displayed at the center of the editor
- Negative values move the line left (up to minus half of the editor width)
- Positive values move the line right (up to half of the editor width)
- Guidelines outside the visible range are ignored

### State and Style

Configure guidelines with the following state and style options:

```typescript
type GuidelineConfig = {
  // ...
  active?: boolean;           // default false
  show?: boolean;             // default true
  styles?: {
    lineStyle?: 'dashed' | 'solid';  // default 'solid'
    color?: CSSToken;                // default undefined
    capStyle?: 'line'                // default undefined
  }
};
```

- `active` - Equivalent to the highlight state in the grid plugin
- `show` - Hide a guideline (useful for animations)
- `styles.color` - Override the guideline color with a valid CSS color
- `styles.lineStyle` - Line style can be 'solid' or 'dashed'
- `styles.capStyle` - Line cap style, supports 'line'

## Support

For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.

## License

Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
