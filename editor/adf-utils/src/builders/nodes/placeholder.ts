import { PlaceholderDefinition } from '@atlaskit/adf-schema';

export const placeholder = (
  attrs: PlaceholderDefinition['attrs'],
): PlaceholderDefinition => ({
  type: 'placeholder',
  attrs,
});
