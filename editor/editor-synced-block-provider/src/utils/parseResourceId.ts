import { SYNC_BLOCK_PRODUCTS } from '../common/consts';
import type { SyncBlockProduct } from '../common/types';

const isSyncBlockProduct = (product: string): product is SyncBlockProduct => {
	return SYNC_BLOCK_PRODUCTS.includes(product as SyncBlockProduct);
};

export const parseResourceId = (
	resourceId: string,
): { contentId: string; product: SyncBlockProduct; uuid: string } | undefined => {
	if (!resourceId) {
		return undefined;
	}

	const [product, contentId, uuid, ...rest] = resourceId.split('/');

	// invalid if any part is missing or there are extra parts
	if (!product || !contentId || !uuid || rest.length > 0) {
		return undefined;
	}

	// invalid if product is not recognized
	if (!isSyncBlockProduct(product)) {
		return undefined;
	}

	return { product, contentId, uuid };
};
