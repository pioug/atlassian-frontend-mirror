import { type SyncBlockDefinition } from '@atlaskit/adf-schema';

export const syncBlock = (attrs: SyncBlockDefinition['attrs']) => (): SyncBlockDefinition => ({
	type: 'syncBlock',
	attrs,
});
