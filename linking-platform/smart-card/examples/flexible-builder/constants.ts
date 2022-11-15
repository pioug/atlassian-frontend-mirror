export enum BlockName {
  FooterBlock = 'FooterBlock',
  MetadataBlock = 'MetadataBlock',
  PreviewBlock = 'PreviewBlock',
  SnippetBlock = 'SnippetBlock',
  TitleBlock = 'TitleBlock',
}

export const DefaultTemplate = {
  blocks: [{ name: BlockName.TitleBlock }],
};

export const ExampleStorageKey = 'lp.example.flexible-builder';
export const FunctionStorageValue = 'Function';
export const ComponentStorageValue = 'CustomComponent';
