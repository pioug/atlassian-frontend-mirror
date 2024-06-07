import { type ProductType } from '@atlaskit/linking-common';

export const getBufferReader = (response: Response): ReadableStreamDefaultReader<string> => {
	if (!response.body) {
		throw new Error('Response body is empty');
	}
	return response.body.pipeThrough(new TextDecoderStream()).getReader();
};

export const addPath = (baseUrl: string, path: string) => {
	const urlWithTrailingSlash = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
	const pathWithoutLeadingSlash = !path.startsWith('/') ? path : path.substring(1, path.length);
	const url = [urlWithTrailingSlash, pathWithoutLeadingSlash].join('');
	return url;
};

/**
 * Subset of a map of Jira `ProductTypes` to AI Mate expected values
 * See for more info: https://atlassian.slack.com/archives/C066UP0G0G3/p1716341647677829?thread_ts=1716338063.255939&cid=C066UP0G0G3
 */
const AiMateJiraXProduct = {
	JSM: 'JSM',
	JSW: 'JIRA-SOFTWARE',
	JWM: 'JIRA-CORE',
	JPD: 'JPD',
} as const;

type JiraProductTypes = keyof typeof AiMateJiraXProduct;

/**
 * Checks if `product` is a Jira related product.
 */
const isJiraProduct = (product: ProductType | undefined): product is JiraProductTypes => {
	const JIRA_PRODUCTS: ProductType[] = ['JPD', 'JSM', 'JSW', 'JWM'] as const;
	return product !== undefined && JIRA_PRODUCTS.includes(product);
};

/**
 * Converts a `ProductType` to the expected `x-product` header value for AI Mate.
 *
 * @see https://developer.atlassian.com/platform/assistance-service/security/entitlements/#approach
 */
export const getXProductHeaderValue = (product: ProductType | undefined) => {
	if (isJiraProduct(product)) {
		return AiMateJiraXProduct[product];
	}
	return product;
};
