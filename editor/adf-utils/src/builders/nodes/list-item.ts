import type { ListItemDefinition, ListItemArray } from '@atlaskit/adf-schema/list';

export const listItem = (content: ListItemArray): ListItemDefinition => ({
	type: 'listItem',
	content,
});
