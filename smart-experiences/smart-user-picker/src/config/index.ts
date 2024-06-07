export const config = {
	getRecommendationServiceUrl(baseUrl: string): string {
		return baseUrl
			? `${baseUrl}/gateway/api/v1/recommendations`
			: '/gateway/api/v1/recommendations';
	},
	getUsersServiceUrl(productKey: string, baseUrl: string = ''): string {
		return productKey === 'jira'
			? `${baseUrl}/rest/api/3/user/bulk`
			: `${baseUrl}/wiki/rest/api/user/bulk`;
	},
	getGraphQLUrl(baseUrl?: string): string {
		return baseUrl ? `${baseUrl}/gateway/api/graphql` : `/gateway/api/graphql`;
	},
	getTeamsUrl(baseUrl?: string): string {
		return baseUrl ? `${baseUrl}/gateway/api/v3/teams` : `/gateway/api/v3/teams`;
	},
};
