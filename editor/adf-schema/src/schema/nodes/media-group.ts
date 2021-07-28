import { NodeSpec } from 'prosemirror-model';
import { MediaDefinition as Media } from './media';

/**
 * @name mediaGroup_node
 */
export interface MediaGroupDefinition {
  type: 'mediaGroup';
  /**
   * @minItems 1
   *  @allowUnsupportedBlock true
   */
  content: Array<Media>;
}

export const mediaGroup: NodeSpec = {
  inline: false,
  group: 'block',
  content: '(media|unsupportedBlock)+',
  attrs: {},
  marks: 'unsupportedMark unsupportedNodeAttribute link',
  selectable: false,
  parseDOM: [
    {
      tag: 'div[data-node-type="mediaGroup"]',
    },
    {
      tag: 'div[class="MediaGroup"]',
    },
  ],

  toDOM() {
    return [
      'div',
      {
        'data-node-type': 'mediaGroup',
      },
      0,
    ];
  },
};
