import type { SyncBlockProduct, SyncBlockStatus } from '../common/types';

export const normaliseSyncBlockProduct = (
	value: string | null | undefined,
): SyncBlockProduct | undefined => {
	return value === 'confluence-page' || value === 'jira-work-item' ? value : undefined;
};

export const normaliseSyncBlockStatus = (
	value: string | null | undefined,
): SyncBlockStatus | undefined => {
	return value === 'active' || value === 'unpublished' || value === 'deleted' ? value : undefined;
};
