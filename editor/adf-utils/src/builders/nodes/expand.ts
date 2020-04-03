import { ExpandDefinition, ExtensionContent } from '@atlaskit/adf-schema';

export const expand = (attrs: ExpandDefinition['attrs']) => (
  ...content: ExtensionContent
): ExpandDefinition => ({
  type: 'expand',
  attrs,
  content,
});
