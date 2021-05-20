import { getConfig } from '../config';
import { RecommendationItem, RecommendationRequest } from './SmartMentionTypes';

const getUserRecommendations = (
  request: RecommendationRequest,
): Promise<RecommendationItem[]> => {
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
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      return Promise.reject({
        message: `error calling smart service, statusCode=${response.status}, statusText=${response.statusText}`,
      });
    })
    .then((response) => response.recommendedUsers);
};

export default getUserRecommendations;
