import { mockProductRecommendationsRegex } from './endpoint-regexes';
import type { MockConfig } from './mock-config-2';
import { MOCK_PRODUCT_RECOMMENDATIONS_RESPONSE } from './responses';

export const mockProductRecommendationsEndpoint: any = ({ fetchMock, delay }: MockConfig) => {
	fetchMock.get(
		mockProductRecommendationsRegex,
		(_: string, options: { body: string }) => MOCK_PRODUCT_RECOMMENDATIONS_RESPONSE,
		{ method: 'GET', overwriteRoutes: true, delay },
	);
};
