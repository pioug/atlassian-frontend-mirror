interface Config {
  getRecommendationServiceUrl(baseUrl: string): string;
  getUsersServiceUrl(productKey: string, baseUrl?: string): string;
  getGraphQLUrl(baseUrl: string | undefined): string;
  getTeamsUrl(baseUrl: string | undefined): string;
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
      ? `${STG_INSTANCE}/${baseUrl}/gateway/api/graphql`
      : `${STG_INSTANCE}/gateway/api/graphql`;
  },
  getTeamsUrl(baseUrl: string) {
    return baseUrl
      ? `${STG_INSTANCE}/${baseUrl}/gateway/api/v3/teams`
      : `${STG_INSTANCE}/gateway/api/v3/teams`;
  },
};

const PRD_CONFIG: Config = {
  getRecommendationServiceUrl(baseUrl: string) {
    return baseUrl
      ? `${baseUrl}/gateway/api/v1/recommendations`
      : '/gateway/api/v1/recommendations';
  },
  getUsersServiceUrl(productKey: string, baseUrl: string = '') {
    return productKey === 'jira'
      ? `${baseUrl}/rest/api/3/user/bulk`
      : `${baseUrl}/wiki/rest/api/user/bulk`;
  },
  getGraphQLUrl(baseUrl: string) {
    return baseUrl ? `${baseUrl}/gateway/api/graphql` : `/gateway/api/graphql`;
  },
  getTeamsUrl(baseUrl: string) {
    return baseUrl
      ? `${baseUrl}/gateway/api/v3/teams`
      : `/gateway/api/v3/teams`;
  },
};

// TODO remove this once no external code is calling it
export const setSmartUserPickerEnv = (newEnv: 'prod' | 'local') =>
  (env = newEnv);

// TODO remove this once no external code is calling it
export const getConfig = () => (env === 'local' ? LOCAL_CONFIG : PRD_CONFIG);
