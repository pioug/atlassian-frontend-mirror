import type { SyncBlockProduct } from '../common/types';

import { fetchMediaToken } from './confluence/fetchMediaToken';
import type { TokenData } from './confluence/fetchMediaToken';
import { fetchJiraMediaToken } from './jira/fetchMediaToken';

export const requiresCrossProductAuth = ({
	hostProduct,
	sourceProduct,
}: {
	hostProduct: SyncBlockProduct;
	sourceProduct?: SyncBlockProduct;
}): boolean => {
	return !!sourceProduct && sourceProduct !== hostProduct;
};

export const fetchTokenForSourceProduct = ({
	contentId,
	sourceProduct,
}: {
	contentId: string;
	sourceProduct?: SyncBlockProduct;
}): Promise<TokenData> => {
	switch (sourceProduct) {
		case 'confluence-page':
			return fetchMediaToken(contentId);
		case 'jira-work-item':
			return fetchJiraMediaToken(contentId);
		default:
			throw new Error(`Unsupported source product for token fetch: ${sourceProduct}`);
	}
};
