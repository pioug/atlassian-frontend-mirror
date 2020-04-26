import {
  BodiedExtensionDefinition,
  NonNestableBlockContent,
} from '@atlaskit/adf-schema';

export const bodiedExtension = (attrs: BodiedExtensionDefinition['attrs']) => (
  ...content: Array<NonNestableBlockContent>
): BodiedExtensionDefinition => ({
  type: 'bodiedExtension',
  attrs,
  content,
});
