import { logException } from '../sentry/main';

import type { ReportingLines } from './utils/types';

import { ReportingLinesClient } from './index';

describe('ReportingLinesClient', () => {
	let client: ReportingLinesClient;

	beforeEach(() => {
		client = new ReportingLinesClient({ logException });
	});

	describe('getReportingLines', () => {
		const userId = 'user-123';

		it('should call makeGraphQLRequest with correct parameters', async () => {
			const mockResponse = { reportingLines: {} as ReportingLines };
			const makeRequestSpy = jest
				.spyOn(ReportingLinesClient.prototype, 'makeGraphQLRequest')
				.mockResolvedValue(mockResponse);

			await client.getReportingLines(userId);

			expect(makeRequestSpy).toHaveBeenCalledWith(
				{
					query: expect.any(String),
					variables: {
						aaid: userId,
					},
				},
				{
					operationName: 'ReportingLines',
				},
			);
		});

		it('should return the correct result', async () => {
			const mockResponse = {
				reportingLines: {} as ReportingLines,
			};
			jest
				.spyOn(ReportingLinesClient.prototype, 'makeGraphQLRequest')
				.mockResolvedValue(mockResponse);

			const result = await client.getReportingLines(userId);
			expect(result).toEqual(mockResponse);
		});
	});
});
