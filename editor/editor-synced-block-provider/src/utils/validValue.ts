import { SYNC_BLOCK_PRODUCTS } from '../common/consts';
import type { SyncBlockProduct, SyncBlockStatus } from '../common/types';

export const normaliseSyncBlockProduct = (
	value: string | null | undefined,
): SyncBlockProduct | undefined => {
	return SYNC_BLOCK_PRODUCTS.includes(value as SyncBlockProduct)
		? (value as SyncBlockProduct)
		: undefined;
};

export const normaliseSyncBlockStatus = (
	value: string | null | undefined,
): SyncBlockStatus | undefined => {
	return value === 'active' || value === 'unpublished' || value === 'deleted' ? value : undefined;
};
