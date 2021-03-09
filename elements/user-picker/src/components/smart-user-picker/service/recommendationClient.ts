import { transformUsers } from './users-transformer';
import { getConfig } from '../config';
import { OptionData } from '../../../types';
import { ProductAttributes, RecommendationRequest } from '../components';
export interface Context {
  containerId?: string;
  contextType: string;
  objectId?: string;
  sessionId?: string;
  principalId?: string;
  childObjectId?: string;
  productKey: 'jira' | 'confluence' | 'people' | 'bitbucket';
  siteId: string;
  productAttributes?: ProductAttributes;
}

const getUserRecommendations = (
  request: RecommendationRequest,
): Promise<OptionData[]> => {
  const url = getConfig().getRecommendationServiceUrl(request.baseUrl || '');
  return fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      context: request.context,
      includeUsers: request.includeUsers,
      includeGroups: request.includeGroups,
      includeTeams: request.includeTeams,
      maxNumberOfResults: request.maxNumberOfResults,
      performSearchQueryOnly: false,
      searchQuery: {
        cpusQueryHighlights: {
          query: '',
          field: '',
        },
        customQuery: '',
        customerDirectoryId: '',
        filter: request.searchQueryFilter || '',
        minimumAccessLevel: 'APPLICATION',
        queryString: request.query,
        restrictTo: {
          userIds: [],
          groupIds: [],
        },
        searchUserbase: false,
      },
    }),
  })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      }
      return Promise.reject({
        message: `error calling smart service, statusCode=${response.status}, statusText=${response.statusText}`,
      });
    })
    .then(transformUsers);
};

export default getUserRecommendations;
