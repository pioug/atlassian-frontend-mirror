import type {
  DocNode,
  BlockContent,
  LayoutSectionDefinition,
  MultiBodiedExtensionDefinition,
} from '@atlaskit/adf-schema';

export const doc = (
  ...content: Array<
    BlockContent | LayoutSectionDefinition | MultiBodiedExtensionDefinition
  >
): DocNode => ({
  type: 'doc',
  version: 1,
  content,
});
