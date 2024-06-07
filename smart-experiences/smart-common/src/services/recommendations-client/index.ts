import { PRD_CONFIG } from '../../config';
import { type UserSearchItem, type UserSearchRequest } from '../../types';

const fetchUserRecommendations = (
	request: UserSearchRequest,
	signal?: AbortSignal,
): Promise<UserSearchItem[]> => {
	const url = PRD_CONFIG.getRecommendationServiceUrl(request.baseUrl);
	return fetch(url, {
		signal,
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
			performSearchQueryOnly: request.performSearchQueryOnly,
			searchQuery: {
				cpusQueryHighlights: {
					query: request.searchQuery?.cpusQueryHighlights?.query ?? '',
					field: request.searchQuery?.cpusQueryHighlights?.field ?? '',
				},
				customQuery: request.searchQuery?.customQuery ?? '',
				customerDirectoryId: request.searchQuery?.customerDirectoryId ?? '',
				filter: request.searchQuery?.filter ?? '',
				minimumAccessLevel: request.searchQuery?.minimumAccessLevel ?? 'APPLICATION',
				queryString: request.query,
				restrictTo: {
					userIds: request.searchQuery?.restrictTo?.userIds ?? [],
					groupIds: request.searchQuery?.restrictTo?.userIds ?? [],
				},
				searchUserbase: request.searchQuery?.searchUserbase ?? false,
			},
		}),
	})
		.then((response) => {
			if (response.status === 200) {
				return response.json();
			}
			throw new Error(
				`error calling smart service, statusCode=${response.status}, statusText=${response.statusText}`,
			);
		})
		.then((response) => response.recommendedUsers);
};

export default fetchUserRecommendations;
