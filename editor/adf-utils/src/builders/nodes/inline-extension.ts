import { InlineExtensionDefinition } from '@atlaskit/adf-schema';

export const inlineExtension = (
  attrs: InlineExtensionDefinition['attrs'],
) => (): InlineExtensionDefinition => ({
  type: 'inlineExtension',
  attrs,
});
