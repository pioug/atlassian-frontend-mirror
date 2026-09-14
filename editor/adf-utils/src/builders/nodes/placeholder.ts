import type { PlaceholderDefinition } from '@atlaskit/adf-schema/placeholder';

export const placeholder = (attrs: PlaceholderDefinition['attrs']): PlaceholderDefinition => ({
	type: 'placeholder',
	attrs,
});
