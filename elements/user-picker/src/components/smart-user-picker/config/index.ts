interface Config {
  getRecommendationServiceUrl(baseUrl: string): string;
  getUsersServiceUrl(productKey: string): string;
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
};

const PRD_CONFIG: Config = {
  getRecommendationServiceUrl(baseUrl: string) {
    return baseUrl
      ? `/${baseUrl}/gateway/api/v1/recommendations`
      : '/gateway/api/v1/recommendations';
  },
  getUsersServiceUrl(productKey: string) {
    return productKey === 'jira'
      ? `/rest/api/3/user/bulk`
      : `/wiki/rest/api/user/bulk`;
  },
};
/**
 * @deprecated Please use @atlassian/smart-user-picker
 */
export const setSmartUserPickerEnv = (newEnv: 'prod' | 'local') =>
  (env = newEnv);
/**
 * @deprecated Please use @atlassian/smart-user-picker
 */
export const getConfig = () => (env === 'local' ? LOCAL_CONFIG : PRD_CONFIG);
/**
 * @deprecated Please use @atlassian/smart-user-picker
 */
export const JDOG_CLOUD_ID = '49d8b9d6-ee7d-4931-a0ca-7fcae7d1c3b5';
