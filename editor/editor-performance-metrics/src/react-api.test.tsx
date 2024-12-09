import React from 'react';

import { act, render } from '@testing-library/react';

import { createCalculator } from './internals/editorPerformanceMetrics';
import { getGlobalEditorMetricsObserver } from './internals/global';
import { PerformanceMetrics } from './react-api';

jest.mock('./internals/global', () => ({
	getGlobalEditorMetricsObserver: jest.fn(),
}));

jest.mock('./internals/editorPerformanceMetrics', () => ({
	createCalculator: jest.fn(),
}));

describe('PerformanceMetrics Component', () => {
	let mockObserver: {
		onIdleBuffer: jest.Mock;
	};
	let unsubscribe: jest.Mock;

	beforeEach(() => {
		jest.useFakeTimers();
		unsubscribe = jest.fn();
		mockObserver = {
			onIdleBuffer: jest.fn(),
		};
		(createCalculator as jest.Mock).mockReturnValue({
			calculateLatencyPercents: jest.fn().mockResolvedValue({}),
			calculateVCTargets: jest.fn().mockResolvedValue({}),
		});
		(getGlobalEditorMetricsObserver as jest.Mock).mockImplementation(() => {
			return mockObserver;
		});

		mockObserver.onIdleBuffer.mockImplementation((cb) => {
			cb({ idleAt: 1, timelineBuffer: null });
			return unsubscribe;
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should set up the observer on mount', () => {
		render(<PerformanceMetrics />);
		expect(mockObserver.onIdleBuffer).toHaveBeenCalled();
	});

	it('should clean up the observer on unmount', async () => {
		const { unmount } = render(<PerformanceMetrics />);

		await act(async () => {
			jest.runAllTimers();
		});

		unmount();

		expect(unsubscribe).toHaveBeenCalled();
	});

	it('should call onUserLatency with calculated latency', async () => {
		const mockLatency = { mouse: { p50: 100, p85: 200, p90: 300, p95: 400, p99: 500 } };
		const onUserLatency = jest.fn();

		(createCalculator as jest.Mock).mockReturnValue({
			calculateLatencyPercents: jest.fn().mockResolvedValue(mockLatency),
			calculateVCTargets: jest.fn().mockResolvedValue({}),
		});

		render(<PerformanceMetrics onUserLatency={onUserLatency} />);

		await act(async () => {
			jest.runAllTimers();
		});

		expect(onUserLatency).toHaveBeenCalledWith({ latency: mockLatency });
	});

	it('should call onTTVC with calculated TTVC and relative TTVC', async () => {
		const mockTTVC = { '25': 1000, '50': 2000, '75': 3000, '99': 4000 };
		const onTTVC = jest.fn();

		(createCalculator as jest.Mock).mockReturnValue({
			calculateLatencyPercents: jest.fn().mockResolvedValue(null),
			calculateVCTargets: jest.fn().mockResolvedValue(mockTTVC),
		});

		render(<PerformanceMetrics onTTVC={onTTVC} />);

		await act(async () => {
			jest.runAllTimers();
		});

		expect(onTTVC).toHaveBeenCalledWith({
			ttvc: mockTTVC,
			relativeTTVC: {
				'25': expect.any(Number),
				'50': expect.any(Number),
				'75': expect.any(Number),
				'99': expect.any(Number),
			},
		});
	});

	it('should not set up observer if it is not available', () => {
		(getGlobalEditorMetricsObserver as jest.Mock).mockReturnValue(null);
		render(<PerformanceMetrics />);
		expect(mockObserver.onIdleBuffer).not.toHaveBeenCalled();
	});
});
