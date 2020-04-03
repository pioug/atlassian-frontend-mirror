import {
  BodiedExtensionDefinition,
  ExtensionContent,
} from '@atlaskit/adf-schema';

export const bodiedExtension = (attrs: BodiedExtensionDefinition['attrs']) => (
  ...content: ExtensionContent
): BodiedExtensionDefinition => ({
  type: 'bodiedExtension',
  attrs,
  content,
});
