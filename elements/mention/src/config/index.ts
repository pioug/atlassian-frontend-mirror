interface Config {
  getRecommendationServiceUrl(baseUrl: string): string;
  getUsersServiceUrl(productKey: string): string;
  getGraphQLUrl(baseUrl: string | undefined): string;
}

let env = 'prod';
const STG_INSTANCE = 'https://api-private.stg.atlassian.com';

const LOCAL_CONFIG: Config = {
  getRecommendationServiceUrl(baseUrl: string) {
    return baseUrl
      ? `${STG_INSTANCE}/${baseUrl}/gateway/api/v1/recommendations`
      : `${STG_INSTANCE}/gateway/api/v1/recommendations`;
  },
  getUsersServiceUrl(productKey: string) {
    return productKey === 'jira'
      ? `https://jdog.jira-dev.com/rest/api/3/user/bulk`
      : `https://pug.jira-dev.com/wiki/rest/api/user/bulk`;
  },
  getGraphQLUrl(baseUrl: string) {
    return baseUrl
      ? `${STG_INSTANCE}/${baseUrl}/graphql`
      : `${STG_INSTANCE}/gateway/api/graphql`;
  },
};

const PRD_CONFIG: Config = {
  getRecommendationServiceUrl(baseUrl: string) {
    return baseUrl
      ? `/${baseUrl}/v1/recommendations`
      : '/gateway/api/v1/recommendations';
  },
  getUsersServiceUrl(productKey: string) {
    return productKey === 'jira'
      ? '/rest/api/3/user/bulk'
      : '/wiki/rest/api/user/bulk';
  },
  getGraphQLUrl(baseUrl: string) {
    return baseUrl ? `/${baseUrl}/graphql` : '/gateway/api/graphql';
  },
};

export const setEnv = (newEnv: 'prod' | 'local') => (env = newEnv);

export const getConfig = () => (env === 'local' ? LOCAL_CONFIG : PRD_CONFIG);
