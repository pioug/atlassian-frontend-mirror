import { SYNC_BLOCK_PRODUCTS } from '../common/consts';
import type { SyncBlockProduct } from '../common/types';

const isSyncBlockProduct = (product: string): product is SyncBlockProduct => {
	return SYNC_BLOCK_PRODUCTS.includes(product as SyncBlockProduct);
};

/*
 * Sync Block resourceId utilities
 * --------------------------------
 * Provides helpers to parse and generate the identifier used to
 * reference a synced block across Atlassian products.
 *
 * Format
 * - {product}/{contentId}/{uuid}
 *   - product: a recognized `SyncBlockProduct` (e.g. 'confluence-page', 'jira-work-item')
 *   - contentId: the host content identifier (e.g. page ID or issue ID)
 *   - uuid: the UUID for the specific synced block instance
 *
 * Examples
 * - confluence-page/8060929/7f9d9cf8-8483-43ee-99f3-6ca576dbf24d
 *
 * Validation rules (enforced by `parseResourceId`)
 * - Must have exactly three path segments separated by '/'
 * - `product` must be one of `SYNC_BLOCK_PRODUCTS`
 * - No extra segments; returns `undefined` on any invalid input
 *
 * Notes
 * - `product` is a qualified domain like 'confluence-page' or 'jira-work-item',
 *   not just 'confluence' or 'jira'.
 */

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

export const createResourceIdForReference = (
	product: SyncBlockProduct,
	contentId: string,
	uuid: string,
): string => {
	return `${product}/${contentId}/${uuid}`;
};
