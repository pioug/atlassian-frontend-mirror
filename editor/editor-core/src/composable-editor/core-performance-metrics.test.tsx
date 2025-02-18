import React from 'react';

import { render, act, screen } from '@testing-library/react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';
import { fireAnalyticsEvent } from '@atlaskit/editor-common/analytics';

import { EditorUFOBridge, EditorPerformanceMetrics } from './core-performance-metrics';

// Mock the required dependencies
jest.mock('@atlaskit/analytics-next/useAnalyticsEvents');
jest.mock('@atlaskit/editor-common/analytics', () => ({
	...jest.requireActual('@atlaskit/editor-common/analytics'),
	fireAnalyticsEvent: jest.fn().mockImplementation((cb) => {
		return (data: unknown) => {
			cb(data);
		};
	}),
}));
jest.mock('@atlaskit/editor-performance-metrics/react', () => ({
	PerformanceMetrics: ({ onTTAI, onTTVC, onUserLatency }: any) => {
		React.useEffect(() => {
			setTimeout(() => {
				onTTAI && onTTAI({ idleAt: 1000 });
				onTTVC && onTTVC({ ttvc: { p50: 1500, p95: 2000 } });
				onUserLatency && onUserLatency({ latency: { p50: 100, p95: 200 } });
			}, 0);
		}, [onTTAI, onTTVC, onUserLatency]);
		return null;
	},
}));
jest.mock('@atlaskit/react-ufo/load-hold', () => ({
	__esModule: true,
	default: ({ hold }: { hold: boolean }) => (
		<div data-testid="ufo-load-hold">{hold.toString()}</div>
	),
}));

beforeEach(() => {
	jest.useFakeTimers();
});

afterEach(() => {
	jest.useRealTimers();
});

describe('EditorUFOBridge', () => {
	it('should render UFOLoadHold with initial hold state as true', () => {
		render(<EditorUFOBridge />);

		expect(screen.getByTestId('ufo-load-hold').textContent).toBe('true');
	});

	it('should update hold state to false when onTTAI is called', async () => {
		const { getByTestId } = render(<EditorUFOBridge />);
		await act(async () => {
			await jest.runAllTimers();
		});
		expect(getByTestId('ufo-load-hold').textContent).toBe('false');
	});
});

describe('EditorPerformanceMetrics', () => {
	const mockCreateAnalyticsEvent = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
		(useAnalyticsEvents as jest.Mock).mockReturnValue({
			createAnalyticsEvent: mockCreateAnalyticsEvent,
		});
	});

	it('should fire analytics event for TTVC', async () => {
		render(<EditorPerformanceMetrics />);

		await act(async () => {
			await jest.runAllTimers();
		});

		expect(fireAnalyticsEvent).toHaveBeenCalledWith(mockCreateAnalyticsEvent);
		expect(fireAnalyticsEvent).toHaveBeenCalledWith(expect.any(Function));
		expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith({
			payload: {
				action: 'ttvc',
				actionSubject: 'editor',
				eventType: 'operational',
				attributes: {
					ttvc: { p50: 1500, p95: 2000 },
					ttai: 1000,
				},
			},
		});
	});

	it('should fire analytics event for latency', async () => {
		render(<EditorPerformanceMetrics />);

		await act(async () => {
			await jest.runAllTimers();
		});

		expect(fireAnalyticsEvent).toHaveBeenCalledWith(mockCreateAnalyticsEvent);
		expect(fireAnalyticsEvent).toHaveBeenCalledWith(expect.any(Function));
		expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith({
			payload: {
				action: 'latency',
				actionSubject: 'editor',
				eventType: 'operational',
				attributes: {
					latency: { p50: 100, p95: 200 },
				},
			},
		});
	});

	it('should only fire each analytics event once', async () => {
		const { rerender } = render(<EditorPerformanceMetrics />);
		await act(async () => {
			await jest.runAllTimers();
		});
		expect(mockCreateAnalyticsEvent).toHaveBeenCalledTimes(2);

		rerender(<EditorPerformanceMetrics />);

		await act(async () => {
			await jest.runAllTimers();
		});

		expect(mockCreateAnalyticsEvent).toHaveBeenCalledTimes(2);

		rerender(<EditorPerformanceMetrics />);

		await act(async () => {
			await jest.runAllTimers();
		});
		expect(mockCreateAnalyticsEvent).toHaveBeenCalledTimes(2);
	});
});
