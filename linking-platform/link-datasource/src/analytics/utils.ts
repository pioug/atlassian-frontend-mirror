import type { JiraSearchMethod } from '../common/types';

export const mapSearchMethod = (searchMethod: JiraSearchMethod) => {
  switch (searchMethod) {
    case 'basic':
      return 'datasource_basic_filter';
    case 'jql':
      return 'datasource_search_query';
    default:
      return 'unknown';
  }
};
