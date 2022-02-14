interface Config {
  getSearchUrl(baseUrl?: string): string;
  getCollaborationGraphUrl(baseUrl?: string): string;
}

const SEARCH_PATH = '/gateway/api/xpsearch-aggregator/quicksearch/v1';
const COLLABORATION_GRAPH_PATH =
  '/gateway/api/collaboration/v1/collaborationgraph/user/container';

export const config: Config = {
  getSearchUrl(baseUrl?: string) {
    return baseUrl ? `/${baseUrl}${SEARCH_PATH}` : SEARCH_PATH;
  },
  getCollaborationGraphUrl(baseUrl?: string) {
    return baseUrl
      ? `/${baseUrl}${COLLABORATION_GRAPH_PATH}`
      : COLLABORATION_GRAPH_PATH;
  },
};
