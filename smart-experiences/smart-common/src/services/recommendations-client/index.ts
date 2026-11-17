import { type UserSearchItem, type UserSearchRequest } from '../../types';
import fetchUserRecommendationsResponse from './response';

const fetchUserRecommendations = (
	request: UserSearchRequest,
	signal?: AbortSignal,
): Promise<UserSearchItem[]> =>
	fetchUserRecommendationsResponse(request, signal).then((response) => response.recommendedUsers);

export default fetchUserRecommendations;
