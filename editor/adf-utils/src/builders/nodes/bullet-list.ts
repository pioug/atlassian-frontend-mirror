import { type BulletListDefinition, type ListItemDefinition } from '@atlaskit/adf-schema';

export const bulletList = (...content: Array<ListItemDefinition>): BulletListDefinition => ({
	type: 'bulletList',
	content,
});
