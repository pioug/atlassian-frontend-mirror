import type { TextDefinition } from '@atlaskit/adf-schema/text';

export const text = (text: string): TextDefinition => ({
	type: 'text',
	text,
});
