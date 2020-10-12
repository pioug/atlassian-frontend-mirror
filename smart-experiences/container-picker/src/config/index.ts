interface Config {
  getSearchUrl(baseUrl?: string): string;
  getCollaborationGraphUrl(baseUrl?: string): string;
}

let env = 'prod';
const STG_INSTANCE = 'https://api-private.stg.atlassian.com';
const SEARCH_PATH = '/gateway/api/xpsearch-aggregator/quicksearch/v1';
const COLLABORATION_GRAPH_PATH =
  '/gateway/api/collaboration/v1/collaborationgraph/user/container';

const LOCAL_CONFIG: Config = {
  getSearchUrl(baseUrl?: string) {
    return baseUrl
      ? `${STG_INSTANCE}/${baseUrl}${SEARCH_PATH}`
      : `${STG_INSTANCE}${SEARCH_PATH}`;
  },

  getCollaborationGraphUrl(baseUrl?: string) {
    return baseUrl
      ? `${STG_INSTANCE}/${baseUrl}${COLLABORATION_GRAPH_PATH}`
      : `${STG_INSTANCE}${COLLABORATION_GRAPH_PATH}`;
  },
};

const PRD_CONFUG: Config = {
  getSearchUrl(baseUrl?: string) {
    return baseUrl ? `/${baseUrl}${SEARCH_PATH}` : SEARCH_PATH;
  },

  getCollaborationGraphUrl(baseUrl?: string) {
    return baseUrl
      ? `/${baseUrl}${COLLABORATION_GRAPH_PATH}`
      : COLLABORATION_GRAPH_PATH;
  },
};

export const setEnv = (newEnv: 'prod' | 'local') => (env = newEnv);

export const getConfig = () => (env === 'local' ? LOCAL_CONFIG : PRD_CONFUG);
