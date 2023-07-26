# EditorPluginGuideline

guideline plugin for @atlaskit/editor-core

## Usage

See `packages/editor/editor-plugin-guideline/src/types.ts` for detailed guideline config interface.

Example usage:

```
pluginInjectionApi?.dependencies?.guideline?.actions?.displayGuideline(view)({
  guidelines: [{
    key: "guideline_01"
    position: {
      x: -100
    }; // The position of the guideline
    active: true,
    style: "dashed",
    color: "rgba(0, 0, 0, 0.2)"
  }, 
  {
    key: "guideline_02"
    position: {
      x: 300
    };
    show: false,
  }]
});
```  

A guideline config consists of three parts:
  - A unique key (required)
  - Position (required)
  - State/Style (optional)

This plugin was designed to be "dumb". Meaning that it only contains very basic logics to render the guidelines. Commonly used configurations and utils will be reside in the `editor-common` package.



## Position:

The following diagram shows:
- The layout of the guideline display area
- The position of a guideline for a given X value.
<pre>



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
               
</pre>

The position value is defined as follow:
  `type Position = { x: number };`
* When x is 0, a vertical line is displayed at the center of the editor (see the diagram above). 
* A negative value will move the line to the left, up to minus half of the editor width.
* A positive value will move the line to the right, up to half of the editor width.
* If a `x` value is outside of the visible range, if will be ignored. (See the todo section)


## State/Style

We have the follow state/style configurations
```
type GuidelineConfig = {
  ...
  active?: boolean;
  show?: boolean;
  styles: {
    lineStyle?: 'dashed' | 'solid'; // default solid
    color?: CSSToken;
    capStyle?: 'line'
  }
};
```

- `active` default `false`, equivalent to the `highlight` state in the `grid` plugin.
- `show` default `true` and you can also hide a guideline, could be useful when you need animations.
- `styles.color`: default `undefined` you can override the color of a guideline with a valid `css` color
- `styles.lineStyle` default `solid`, and we also support `dashed`
- `styles.capStyle` default undefined, and support `line`

## TODO
- [ ] Add unit/vr tests
- [ ] Handle guidelines which are outside of visitable range. 
- [ ] Implement the Grid plug option, `shouldCalcBreakoutGridLines?: boolean;`
- [ ] Retire the exist Grid plugin. and replace it with this plugin. Plugins currently use the grid plugin: media, table and card.
- [ ] Investigate a better way to handle the `color` attribute, to avoid a fragmented experiences in the Editor.

