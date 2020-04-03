import { MarkSpec } from 'prosemirror-model';
import { ALIGNMENT, INDENTATION } from '../groups';

export interface IndentationMarkAttributes {
  /**
   * @minimum 1
   * @maximum 6
   */
  level: number;
}

/**
 * @name indentation_mark
 */
export interface IndentationMarkDefinition {
  type: 'indentation';
  attrs: IndentationMarkAttributes;
}

export const indentation: MarkSpec = {
  excludes: `indentation ${ALIGNMENT}`,
  group: INDENTATION,
  attrs: {
    level: {},
  },
  parseDOM: [
    {
      tag: 'div.fabric-editor-indentation-mark',
      getAttrs(dom) {
        const level = +((dom as HTMLElement).getAttribute('data-level') || '0');
        return {
          level: level > 6 ? 6 : level < 1 ? false : level,
        };
      },
    },
  ],
  toDOM(mark) {
    return [
      'div',
      {
        class: 'fabric-editor-block-mark fabric-editor-indentation-mark',
        'data-level': mark.attrs.level,
      },
      0,
    ];
  },
};
