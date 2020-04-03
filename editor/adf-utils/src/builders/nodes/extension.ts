import { ExtensionDefinition } from '@atlaskit/adf-schema';

export const extension = (
  attrs: ExtensionDefinition['attrs'],
): ExtensionDefinition => ({
  type: 'extension',
  attrs,
});
