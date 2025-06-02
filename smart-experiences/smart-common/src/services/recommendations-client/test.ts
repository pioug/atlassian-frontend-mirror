import { PRD_CONFIG } from '../../config';

import fetchUserRecommendations from './index';

jest.mock('../../config', () => ({
	PRD_CONFIG: {
		getRecommendationServiceUrl: jest.fn(),
	},
}));

const mockFetch = jest.fn();
global.fetch = mockFetch as any;

describe('fetchUserRecommendations', () => {
	const baseUrl = 'https://api.example.com';
	const request = {
		baseUrl,
		context: 'test-context',
		includeUsers: true,
		includeGroups: false,
		includeTeams: false,
		maxNumberOfResults: 5,
		performSearchQueryOnly: false,
		query: 'test',
		searchQuery: {},
	};

	beforeEach(() => {
		jest.clearAllMocks();
		(PRD_CONFIG.getRecommendationServiceUrl as jest.Mock).mockReturnValue(
			'https://service.url/recommend',
		);
	});

	it('returns recommended users on 200 response', async () => {
		const recommendedUsers = [{ id: 1, name: 'User' }];
		mockFetch.mockResolvedValueOnce({
			status: 200,
			json: () => Promise.resolve({ recommendedUsers }),
		});

		const result = await fetchUserRecommendations(request as any);
		expect(result).toEqual(recommendedUsers);
		expect(mockFetch).toHaveBeenCalledWith(
			'https://service.url/recommend',
			expect.objectContaining({
				method: 'POST',
				headers: expect.objectContaining({ 'content-type': 'application/json' }),
			}),
		);
	});

	it('throws error on non-200 response', async () => {
		mockFetch.mockResolvedValueOnce({
			status: 500,
			statusText: 'Internal Server Error',
		});

		await expect(fetchUserRecommendations(request as any)).rejects.toThrow(
			/error calling smart service, statusCode=500/,
		);
	});

	it('passes AbortSignal if provided', async () => {
		const signal = new AbortController().signal;
		mockFetch.mockResolvedValueOnce({
			status: 200,
			json: () => Promise.resolve({ recommendedUsers: [] }),
		});

		await fetchUserRecommendations(request as any, signal);
		expect(mockFetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ signal }));
	});
});
