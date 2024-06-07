export const config = {
	getRecommendationServiceUrl(baseUrl?: string) {
		return baseUrl ? `/${baseUrl}/v1/recommendations` : '/gateway/api/v1/recommendations';
	},
	getUsersServiceUrl(productKey: string) {
		return productKey === 'jira' ? '/rest/api/3/user/bulk' : '/wiki/rest/api/user/bulk';
	},
	getGraphQLUrl(baseUrl?: string) {
		return baseUrl ? `/${baseUrl}/graphql` : '/gateway/api/graphql';
	},
};
