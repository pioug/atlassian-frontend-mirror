import { NodeSpec } from 'prosemirror-model';
import { BlockContent } from './types/block-content';

/**
 * @name layoutColumn_node
 */
export interface LayoutColumnDefinition {
  type: 'layoutColumn';
  attrs: {
    /**
     * @minimum 0
     * @maximum 100
     */
    width: number;
  };
  /**
   * @minItems 1
   * @allowUnsupportedBlock true
   */
  content: Array<BlockContent>;
}

export const layoutColumn: NodeSpec = {
  content: '(block|unsupportedBlock)+',
  isolating: true,
  marks:
    'link alignment indentation dataConsumer unsupportedMark unsupportedNodeAttribute',
  selectable: false,
  attrs: {
    width: {
      default: undefined,
    },
  },
  parseDOM: [
    {
      context: 'layoutColumn//',
      tag: 'div[data-layout-column]',
      skip: true,
    },
    {
      tag: 'div[data-layout-column]',
      getAttrs: (domNode) => {
        const dom = domNode as HTMLElement;
        return {
          width: Number(dom.getAttribute('data-column-width')) || undefined,
        };
      },
    },
  ],
  toDOM(node) {
    const attrs: Record<string, string> = {
      'data-layout-column': 'true',
    };
    const { width } = node.attrs;
    if (width) {
      attrs['style'] = `flex-basis: ${width}%`;
      attrs['data-column-width'] = width;
    }

    // We need to apply a attribute to the inner most child to help
    // ProseMirror identify its boundaries better.
    const contentAttrs: Record<string, string> = {
      'data-layout-content': 'true',
    };

    return ['div', attrs, ['div', contentAttrs, 0]];
  },
};
