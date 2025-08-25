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
		onceNextIdle: jest.Mock;
		onIdleBuffer: jest.Mock;
		start: jest.Mock;
		stop: jest.Mock;
	};
	let unsubscribe: jest.Mock;

	beforeEach(() => {
		jest.useFakeTimers();
		unsubscribe = jest.fn();
		mockObserver = {
			onIdleBuffer: jest.fn(),
			onceNextIdle: jest.fn(),
			start: jest.fn(),
			stop: jest.fn(),
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

		mockObserver.onceNextIdle.mockImplementation((cb) => {
			cb({ idleAt: 1, timelineBuffer: null });
			return unsubscribe;
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('when using onTTVC', () => {
		it('should set up the observer on mount', () => {
			render(<PerformanceMetrics onTTVC={jest.fn()} />);
			expect(mockObserver.onceNextIdle).toHaveBeenCalled();
		});
	});

	describe('when using onUserLatency', () => {
		it('should set up the observer on mount', () => {
			render(<PerformanceMetrics onUserLatency={jest.fn()} />);
			expect(mockObserver.onIdleBuffer).toHaveBeenCalled();
		});
	});

	it('should clean up the observer on unmount', async () => {
		const { unmount } = render(<PerformanceMetrics onTTVC={jest.fn()} />);

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
		expect(mockObserver.onceNextIdle).not.toHaveBeenCalled();
	});

	describe('when using onTTAI', () => {
		it('should set up the observer on mount', () => {
			render(<PerformanceMetrics onTTAI={jest.fn()} />);
			expect(mockObserver.onceNextIdle).toHaveBeenCalled();
		});

		it('should call onTTAI with idleAt time', async () => {
			const onTTAI = jest.fn();
			const idleAt = 1000;

			mockObserver.onceNextIdle.mockImplementation((cb) => {
				cb({ idleAt, timelineBuffer: null });
				return unsubscribe;
			});

			render(<PerformanceMetrics onTTAI={onTTAI} />);

			await act(async () => {
				jest.runAllTimers();
			});

			expect(onTTAI).toHaveBeenCalledWith({ idleAt });
		});
	});

	describe('SSR support', () => {
		let originalEnv: NodeJS.ProcessEnv;

		beforeEach(() => {
			originalEnv = process.env;
			process.env = { ...originalEnv, REACT_SSR: 'true' };
		});

		afterEach(() => {
			process.env = originalEnv;
		});

		it('should not set up observer in SSR mode', () => {
			render(
				<PerformanceMetrics onTTVC={jest.fn()} onUserLatency={jest.fn()} onTTAI={jest.fn()} />,
			);
			expect(getGlobalEditorMetricsObserver).not.toHaveBeenCalled();
			expect(mockObserver.onIdleBuffer).not.toHaveBeenCalled();
			expect(mockObserver.onceNextIdle).not.toHaveBeenCalled();
		});
	});

	it('should handle null observer gracefully', () => {
		(getGlobalEditorMetricsObserver as jest.Mock).mockReturnValue(null);
		const onTTVC = jest.fn();
		const onUserLatency = jest.fn();
		const onTTAI = jest.fn();

		render(<PerformanceMetrics onTTVC={onTTVC} onUserLatency={onUserLatency} onTTAI={onTTAI} />);

		expect(onTTVC).not.toHaveBeenCalled();
		expect(onUserLatency).not.toHaveBeenCalled();
		expect(onTTAI).not.toHaveBeenCalled();
	});

	describe('when mounting the component', () => {
		it('should start the observer', () => {
			render(<PerformanceMetrics />);

			expect(mockObserver.start).toHaveBeenCalled();
		});
	});

	describe('when unmounting the component', () => {
		it('should stop the observer', () => {
			const { unmount } = render(<PerformanceMetrics />);

			unmount();

			expect(mockObserver.stop).toHaveBeenCalled();
		});
	});
});
