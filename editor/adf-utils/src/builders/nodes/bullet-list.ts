import type { BulletListDefinition, ListItemDefinition } from '@atlaskit/adf-schema/list';

export const bulletList = (...content: Array<ListItemDefinition>): BulletListDefinition => ({
	type: 'bulletList',
	content,
});
