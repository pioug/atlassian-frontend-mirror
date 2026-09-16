import { waitFor } from '@testing-library/react';

import { failGate } from '@atlassian/feature-flags-test-utils/mock-gates';

const mockBarrelLoaded = jest.fn();
const mockMainLoaded = jest.fn();
const mockExtraLoaded = jest.fn();

jest.mock('../create-payload', () => {
	mockBarrelLoaded();
	return {
		...jest.requireMock('../create-payload/createPayloads'),
		...jest.requireMock('../create-payload/createExtraSearchPageInteractionPayload'),
	};
});
jest.mock('../create-payload/createPayloads', () => {
	mockMainLoaded();
	return { createPayloads: jest.fn().mockResolvedValue([{ event: 'main' }]) };
});
jest.mock('../create-payload/createExtraSearchPageInteractionPayload', () => {
	mockExtraLoaded();
	return {
		createExtraSearchPageInteractionPayload: jest.fn().mockResolvedValue([{ event: 'extra' }]),
	};
});
jest.mock('../create-post-interaction-log-payload', () => ({
	__esModule: true,
	default: jest.fn(),
}));
jest.mock('../create-terminal-error-payload', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('../interaction-metrics', () => ({
	sinkInteractionHandler: jest.fn(),
	sinkPostInteractionLogHandler: jest.fn(),
}));
jest.mock(
	'../create-extra-search-page-interaction-payload/sink-extra-search-page-interaction-handler',
	() => ({
		sinkExtraSearchPageInteractionHandler: jest.fn(),
	}),
);
jest.mock('../set-terminal-error', () => ({ sinkTerminalErrorHandler: jest.fn() }));
jest.mock('../machine-utilisation', () => ({
	initialiseMemoryObserver: jest.fn(),
	initialisePressureObserver: jest.fn(),
}));
jest.mock('../hidden-timing', () => ({
	setupHiddenTimingCapture: jest.fn(),
	setupThrottleDetection: jest.fn(),
}));
jest.mock('../additional-payload/utils/lighthouse-metrics/startLighthouseObserver', () => ({
	startLighthouseObserver: jest.fn(),
}));
jest.mock('../interactions-performance-observer/get-performance-observer', () => ({
	getPerformanceObserver: () => ({ observe: jest.fn() }),
}));
jest.mock('./schedule-idle-callback', () => ({
	__esModule: true,
	default: (callback: () => void) => callback(),
}));

it('lazily loads direct payload modules once and wires both interaction sinks', async () => {
	failGate('platform_ufo_enable_otel_context_manager');
	const { init } = await import('./index');
	expect(mockMainLoaded).not.toHaveBeenCalled();
	expect(mockExtraLoaded).not.toHaveBeenCalled();
	const client = { sendOperationalEvent: jest.fn() };
	const analytics = Promise.resolve(client);
	const config: Parameters<typeof init>[1] = {
		product: 'test',
		region: 'test',
		extraSearchPageInteraction: {
			enabled: true,
			searchPageMetricName: 'test-search',
			searchPageRoute: '/search',
		},
	};
	init(analytics, config);
	const { sinkInteractionHandler } = jest.requireMock('../interaction-metrics');
	const { sinkExtraSearchPageInteractionHandler } = jest.requireMock(
		'../create-extra-search-page-interaction-payload/sink-extra-search-page-interaction-handler',
	);
	await waitFor(() => expect(sinkExtraSearchPageInteractionHandler).toHaveBeenCalledTimes(1));
	expect(sinkInteractionHandler).toHaveBeenCalledTimes(1);
	expect(mockBarrelLoaded).not.toHaveBeenCalled();
	expect(mockMainLoaded).toHaveBeenCalledTimes(1);
	expect(mockExtraLoaded).toHaveBeenCalledTimes(1);
	const interaction = { id: 'interaction' };
	sinkInteractionHandler.mock.calls[0][0]('interaction', interaction);
	sinkExtraSearchPageInteractionHandler.mock.calls[0][0]('interaction', interaction);
	await waitFor(() => expect(client.sendOperationalEvent).toHaveBeenCalledTimes(2));
	expect(client.sendOperationalEvent).toHaveBeenCalledWith({ event: 'main' });
	expect(client.sendOperationalEvent).toHaveBeenCalledWith({ event: 'extra' });
	init(analytics, config);
	expect(sinkInteractionHandler).toHaveBeenCalledTimes(1);
	expect(mockMainLoaded).toHaveBeenCalledTimes(1);
	expect(mockExtraLoaded).toHaveBeenCalledTimes(1);
});
