import { ADFEntity, EntityParent } from '../types';
import { ValueReplacements } from './default-value-replacements';
import { scrubAttrs } from './scrub-content';

export type NodeReplacer = (
  node: ADFEntity,
  context: {
    parent: EntityParent;
    valueReplacements: ValueReplacements;
  },
) => ADFEntity | null | false;

export type NodeReplacements = {
  [key: string]: NodeReplacer;
};

const card: NodeReplacer = (node, { valueReplacements }) => ({
  type: node.type,
  attrs: {
    url: valueReplacements.href(node.attrs?.url),
  },
});

const mediaParent: NodeReplacer = (node) => ({
  type: node.type,
  attrs: node.attrs ? (scrubAttrs(node.type, node.attrs) as any) : undefined,
  content: node.content?.filter((c) => c?.type === 'media'),
});

export const defaultNodeReplacements: NodeReplacements = {
  emoji: () => ({
    type: 'emoji',
    attrs: {
      shortName: ':blue_star:',
      id: 'atlassian-blue_star',
      text: ':blue_star:',
    },
  }),
  date: () => ({
    type: 'date',
    attrs: {
      timestamp: new Date('2020-01-01').getTime(),
    },
  }),
  mention: () => ({
    type: 'mention',
    attrs: {
      id: 'error:NotFound',
      text: '@Nemo',
      accessLevel: 'CONTAINER',
    },
  }),
  inlineCard: card,
  blockCard: card,
  mediaSingle: mediaParent,
  mediaGroup: mediaParent,
  media: (node, { parent }) => {
    const defaults =
      parent.node?.type === 'mediaSingle'
        ? { width: 600, height: 400 }
        : { width: 150, height: 125 };

    const width = node.attrs?.width ?? defaults.width;
    const height = node.attrs?.height ?? defaults.height;

    return {
      type: 'media',
      attrs: {
        ...(scrubAttrs('media', node.attrs) as any),
        type: 'external',
        url: `https://dummyimage.com/${width}x${height}/f4f5f7/a5adba`,
      },
    };
  },
};
