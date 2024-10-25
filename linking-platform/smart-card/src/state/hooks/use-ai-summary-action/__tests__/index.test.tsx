import '@atlaskit/link-test-helpers/jest';

import React from 'react';

import { renderHook } from '@testing-library/react-hooks';
import fetchMock from 'jest-fetch-mock';
import TestRenderer from 'react-test-renderer';
import uuid from 'uuid';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { SmartCardProvider } from '@atlaskit/link-provider';

import { ANALYTICS_CHANNEL } from '../../../../utils/analytics';
import { mocks } from '../../../../utils/mocks';
import * as ufo from '../../../analytics/ufoExperiences';
import { aiSummaryMocks } from '../../__tests__/__mocks__/ai-summary-mocks';
import { readStream } from '../../use-ai-summary/ai-summary-service/readStream';
import { AISummariesStore } from '../../use-ai-summary/ai-summary-service/store';
import { ChunkProcessingError } from '../../use-ai-summary/ai-summary-service/types';
import useAISummaryAction from '../index';

jest.mock('uuid', () => ({
	...jest.requireActual('uuid'),
	__esModule: true,
	default: jest.fn().mockReturnValue('some-uuid-1'),
}));

jest.mock('../../use-ai-summary/ai-summary-service/readStream', () => ({
	readStream: jest.fn(),
}));

const { act } = TestRenderer;

describe('useAISummaryAction', () => {
	const url = 'test-url';
	const analyticSpy = jest.fn();

	const wrapper = ({ children }: { children: React.ReactNode }) => (
		<AnalyticsListener onEvent={analyticSpy} channel={ANALYTICS_CHANNEL}>
			<SmartCardProvider
				isAdminHubAIEnabled={true}
				product="JSM"
				storeOptions={{
					initialState: {
						[url]: {
							status: 'resolved' as const,
							details: mocks.success,
						},
					},
				}}
			>
				{children}
			</SmartCardProvider>
		</AnalyticsListener>
	);

	beforeEach(() => {
		fetchMock.resetMocks();
		AISummariesStore.clear();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should not try to initiate AI Summary Service when URL is an empty string', async () => {
		const storeSetSpy = jest.spyOn(AISummariesStore, 'set');

		renderHook(() => useAISummaryAction(''), { wrapper });

		expect(storeSetSpy).toHaveBeenCalledTimes(0);
		storeSetSpy.mockRestore();
	});

	it('sets status on successful response', async () => {
		fetchMock.mockResolvedValueOnce({ ok: true, status: 200 } as Response);
		(readStream as jest.Mock).mockImplementationOnce(aiSummaryMocks.readStreamSuccess);

		const { result } = renderHook(() => useAISummaryAction(url), { wrapper });
		await act(async () => {
			await result.current.summariseUrl();
		});

		expect(result.current.state?.status).toBe('done');
		expect(result.current.state?.content).toBe('something');
	});

	it('sets status on summariseUrl error response', async () => {
		fetchMock.mockRejectOnce(new Error('foo'));
		const { result } = renderHook(() => useAISummaryAction(url), { wrapper });
		await act(async () => {
			await result.current.summariseUrl();
		});
		expect(result.current.state?.status).toBe('error');
		expect(result.current.state?.content).toBe('');
		expect(result.current.state?.error).toBe('UNEXPECTED');
	});

	it('sets status on summariseUrl successful response with error message', async () => {
		fetchMock.mockResolvedValueOnce({ ok: true, status: 200 } as Response);
		(readStream as jest.Mock).mockImplementationOnce(aiSummaryMocks.readStreamError);

		const { result } = renderHook(() => useAISummaryAction(url), { wrapper });
		await act(async () => {
			await result.current.summariseUrl();
		});
		expect(result.current.state?.status).toBe('error');
		expect(result.current.state?.content).toBe('');
		expect(result.current.state?.error).toBe('NETWORK_ERROR');
	});

	it('sets status on summariseUrl successful response with error message mid stream', async () => {
		fetchMock.mockResolvedValueOnce({ ok: true, status: 200 } as Response);
		(readStream as jest.Mock).mockImplementationOnce(aiSummaryMocks.readStreamErrorMulti);

		const { result } = renderHook(() => useAISummaryAction(url), { wrapper });
		await act(async () => {
			await result.current.summariseUrl();
		});
		expect(result.current.state?.status).toBe('error');
		expect(result.current.state?.content).toBe('');
		expect(result.current.state?.error).toBe('NETWORK_ERROR');
	});

	describe('with analytics', () => {
		it('sends summary success event', async () => {
			const experienceId = 'ufo-experience-success-id';
			const ufoStartSpy = jest.spyOn(ufo, 'startUfoExperience');
			const ufoSucceedSpy = jest.spyOn(ufo, 'succeedUfoExperience');

			uuid.mockReturnValueOnce(experienceId);
			fetchMock.mockResolvedValueOnce({ ok: true, status: 200 } as Response);
			(readStream as jest.Mock).mockImplementationOnce(aiSummaryMocks.readStreamSuccess);

			const { result } = renderHook(() => useAISummaryAction(url), { wrapper });

			await act(async () => {
				await result.current.summariseUrl();
			});

			expect(analyticSpy).toBeFiredWithAnalyticEventOnce(
				{
					payload: {
						actionSubject: 'summary',
						action: 'success',
					},
				},
				ANALYTICS_CHANNEL,
			);
			expect(ufoStartSpy).toHaveBeenCalledTimes(1);
			expect(ufoStartSpy).toHaveBeenCalledWith('smart-link-ai-summary', experienceId);
			expect(ufoSucceedSpy).toHaveBeenCalledTimes(1);
			expect(ufoSucceedSpy).toHaveBeenCalledWith('smart-link-ai-summary', experienceId);
		});

		it.each([
			[false, 'ACCEPTABLE_USE_VIOLATIONS'],
			[false, 'HIPAA_CONTENT_DETECTED'],
			[false, 'EXCEEDING_CONTEXT_LENGTH_ERROR'],
			[true, 'UNEXPECTED'],
			[true, 'RATE_LIMIT'],
		])(
			'sends summary failed event with %s for isSloError when reason is %s',
			async (expected: boolean, reason?: string) => {
				fetchMock.mockRejectOnce(new ChunkProcessingError(reason));

				const { result } = renderHook(() => useAISummaryAction(url), { wrapper });
				await act(async () => {
					await result.current.summariseUrl();
				});

				expect(analyticSpy).toBeFiredWithAnalyticEventOnce(
					{
						payload: {
							actionSubject: 'summary',
							action: 'failed',
							attributes: {
								reason: reason,
								isSloError: expected,
							},
						},
					},
					ANALYTICS_CHANNEL,
				);
			},
		);
	});
});
