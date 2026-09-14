import type { SyncBlockDefinition } from '@atlaskit/adf-schema/sync-block';

export const syncBlock = (attrs: SyncBlockDefinition['attrs']) => (): SyncBlockDefinition => ({
	type: 'syncBlock',
	attrs,
});
