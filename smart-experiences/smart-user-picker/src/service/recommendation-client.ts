import { type OptionData } from '@atlaskit/user-picker';

import { transformUsers } from './users-transformer';
import { config } from '../config';
import { type ConfluenceAttributes, type RecommendationRequest } from '../types';
import { type IntlShape } from 'react-intl-next';

export interface SUPError extends Error {
	message: string;
	statusCode: number;
}

const getUserRecommendations = (
	request: RecommendationRequest,
	intl: IntlShape,
): Promise<OptionData[]> => {
	const url = config.getRecommendationServiceUrl(request.baseUrl || '');
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
			includeNonLicensedUsers: request.includeNonLicensedUsers,
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
				restrictTo: request.restrictTo || {
					userIds: [],
					groupIds: [],
				},
				searchUserbase: false,
				searchEmail: request.searchEmail,
			},
		}),
	})
		.then((response) => {
			if (response.status === 200) {
				return response.json();
			}
			return Promise.reject({
				message: `error calling smart service, statusCode=${response.status}, statusText=${response.statusText}`,
				statusCode: response.status,
			});
		})
		.then((response) => transformUsers(response, intl));
};

export default getUserRecommendations;
