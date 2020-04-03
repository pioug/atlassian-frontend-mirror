import {
  DocNode,
  BlockContent,
  LayoutSectionDefinition,
} from '@atlaskit/adf-schema';

export const doc = (
  ...content: Array<BlockContent | LayoutSectionDefinition>
): DocNode => ({
  type: 'doc',
  version: 1,
  content,
});
