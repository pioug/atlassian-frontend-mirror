interface Config {
  getRecommendationServiceUrl(baseUrl?: string): string;
  getUsersServiceUrl(productKey: string): string;
  getGraphQLUrl(baseUrl?: string): string;
  getTeamsUrl(baseUrl?: string): string;
}

export const PRD_CONFIG: Config = {
  getRecommendationServiceUrl(baseUrl?: string) {
    return baseUrl
      ? `${baseUrl}/gateway/api/v1/recommendations`
      : '/gateway/api/v1/recommendations';
  },
  getUsersServiceUrl(productKey: string) {
    return productKey === 'jira'
      ? `/rest/api/3/user/bulk`
      : `/wiki/rest/api/user/bulk`;
  },
  getGraphQLUrl(baseUrl?: string) {
    return baseUrl ? `${baseUrl}/graphql` : `/graphql`;
  },
  getTeamsUrl(baseUrl?: string) {
    return baseUrl
      ? `/${baseUrl}/gateway/api/v3/teams`
      : `/gateway/api/v3/teams`;
  },
};
