import { MarkSpec } from 'prosemirror-model';

const allowedTypes = ['wide', 'full-width'];

export type BreakoutMarkAttrs = {
  mode: 'wide' | 'full-width';
};

/**
 * @name breakout_mark
 */
export interface BreakoutMarkDefinition {
  type: 'breakout';
  attrs: BreakoutMarkAttrs;
}

export const breakout: MarkSpec = {
  spanning: false,
  inclusive: false,
  parseDOM: [
    {
      tag: 'div.fabric-editor-breakout-mark',
      getAttrs(dom) {
        const mode = (dom as HTMLElement).getAttribute('data-mode');

        return {
          mode: allowedTypes.indexOf(mode || '') === -1 ? 'wide' : mode,
        };
      },
    },
  ],
  attrs: {
    mode: { default: 'wide' },
  },
  toDOM(mark) {
    return [
      'div',
      { class: 'fabric-editor-breakout-mark', 'data-mode': mark.attrs.mode },
      0,
    ];
  },
};
