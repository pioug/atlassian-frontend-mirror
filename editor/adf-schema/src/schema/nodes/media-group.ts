import { NodeSpec } from '@atlaskit/editor-prosemirror/model';
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

// Temporary due to an existing issue in validator below:
// https://product-fabric.atlassian.net/jira/servicedesk/projects/DTR/queues/issue/DTR-1429
// TODO: Remove border and link marks from white list
export const mediaGroup: NodeSpec = {
  inline: false,
  group: 'block',
  content: '(media|unsupportedBlock)+',
  attrs: {},
  marks: 'unsupportedMark unsupportedNodeAttribute border link',
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
