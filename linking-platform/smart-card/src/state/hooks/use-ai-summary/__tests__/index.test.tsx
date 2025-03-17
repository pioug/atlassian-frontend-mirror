import React from 'react';

import { renderHook } from '@testing-library/react-hooks';
import '@atlaskit/link-test-helpers/jest';
import fetchMock from 'jest-fetch-mock';
import { IntlProvider } from 'react-intl-next';
import TestRenderer from 'react-test-renderer';

import { aiSummaryMocks } from '../../__tests__/__mocks__/ai-summary-mocks';
import { readStream } from '../ai-summary-service/readStream';
import { AISummariesStore } from '../ai-summary-service/store';
import { useAISummary } from '../index';

jest.mock('uuid', () => ({
	...jest.requireActual('uuid'),
	__esModule: true,
	default: jest.fn().mockReturnValue('some-uuid-1'),
}));

jest.mock('../ai-summary-service/readStream', () => ({
	readStream: jest.fn(),
}));

const { act } = TestRenderer;

const mockUseAISummaryProps = { url: 'test-url', ari: 'test-ari' };

describe('useAISummary', () => {
	const wrapper = ({ children }: { children: React.ReactNode }) => (
		<IntlProvider locale="en">{children}</IntlProvider>
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

		renderHook(
			() =>
				useAISummary({
					url: '',
				}),
			{ wrapper },
		);

		expect(storeSetSpy).toHaveBeenCalledTimes(0);
		storeSetSpy.mockRestore();
	});

	it('sets status on successful response', async () => {
		fetchMock.mockResolvedValueOnce({ ok: true, status: 200 } as Response);
		(readStream as jest.Mock).mockImplementationOnce(aiSummaryMocks.readStreamSuccess);

		const { result } = renderHook(() => useAISummary(mockUseAISummaryProps), { wrapper });
		await act(async () => {
			await result.current.summariseUrl();
		});

		expect(result.current.state?.status).toBe('done');
		expect(result.current.state?.content).toBe('something');
	});

	it('sets status on summariseUrl error response', async () => {
		fetchMock.mockRejectOnce(new Error('foo'));
		const { result } = renderHook(() => useAISummary(mockUseAISummaryProps), { wrapper });
		await act(async () => {
			await result.current.summariseUrl();
		});
		expect(result.current.state?.status).toBe('error');
		expect(result.current.state?.content).toBe('');
	});

	it('sets status on summariseUrl successful response with error message', async () => {
		fetchMock.mockResolvedValueOnce({ ok: true, status: 200 } as Response);
		(readStream as jest.Mock).mockImplementationOnce(aiSummaryMocks.readStreamError);

		const { result } = renderHook(() => useAISummary(mockUseAISummaryProps), { wrapper });
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

		const { result } = renderHook(() => useAISummary(mockUseAISummaryProps), { wrapper });
		await act(async () => {
			await result.current.summariseUrl();
		});
		expect(result.current.state?.status).toBe('error');
		expect(result.current.state?.content).toBe('');
		expect(result.current.state?.error).toBe('NETWORK_ERROR');
	});
});
