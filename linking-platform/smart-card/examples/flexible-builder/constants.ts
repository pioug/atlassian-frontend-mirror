import { FlexibleTemplate } from './types';

export enum BlockName {
  ActionBlock = 'ActionBlock',
  FooterBlock = 'FooterBlock',
  MetadataBlock = 'MetadataBlock',
  PreviewBlock = 'PreviewBlock',
  SnippetBlock = 'SnippetBlock',
  TitleBlock = 'TitleBlock',
}

export const FlexibleDefaultTemplate = {
  blocks: [{ name: BlockName.TitleBlock }],
};

export const DefaultTemplate: FlexibleTemplate = {
  cardProps: { appearance: 'block' as const },
  ...FlexibleDefaultTemplate,
};

export const ExampleStorageKey = 'lp.example.flexible-builder';
export const FunctionStorageValue = 'Function';
export const ComponentStorageValue = 'CustomComponent';
