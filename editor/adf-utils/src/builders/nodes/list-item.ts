import { type ListItemDefinition, type ListItemArray } from '@atlaskit/adf-schema';

export const listItem = (content: ListItemArray): ListItemDefinition => ({
	type: 'listItem',
	content,
});
