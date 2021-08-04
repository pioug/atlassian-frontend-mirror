import { transformUsers } from './users-transformer';
import { getConfig } from '../config';
import { OptionData } from '../../../types';
import {
  ProductAttributes,
  ConfluenceAttributes,
  RecommendationRequest,
} from '../components';
import { InjectedIntl } from 'react-intl';

/**
 * @deprecated Please use @atlassian/smart-user-picker
 */
export interface Context {
  containerId?: string;
  contextType: string;
  objectId?: string;
  sessionId?: string;
  principalId?: string;
  childObjectId?: string;
  productKey: 'jira' | 'confluence' | 'people' | 'bitbucket' | 'compass';
  siteId: string;
  productAttributes?: ProductAttributes;
}

const getUserRecommendations = (
  request: RecommendationRequest,
  intl: InjectedIntl,
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
        ...((request.context?.productAttributes as ConfluenceAttributes)
          ?.isEntitledConfluenceExternalCollaborator && {
          productAccessPermissionIds: ['write', 'external-collaborator-write'],
        }),
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
    .then((response) => transformUsers(response, intl));
};

/**
 * @deprecated Please use @atlassian/smart-user-picker
 */
export default getUserRecommendations;
