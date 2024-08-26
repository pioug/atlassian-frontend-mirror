import React from 'react';

import { renderHook, type RenderHookOptions } from '@testing-library/react-hooks';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import { captureException } from '@atlaskit/linking-common/sentry';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { EVENT_CHANNEL } from '../../analytics';
import useErrorLogger, { type UseErrorLoggerProps } from '../useErrorLogger';

jest.mock('@atlaskit/platform-feature-flags');

jest.mock('@atlaskit/linking-common/sentry', () => {
	const originalModule = jest.requireActual('@atlaskit/link-client-extension');
	return {
		...originalModule,
		captureException: jest.fn(),
	};
});

const onAnalyticFireEvent = jest.fn();

const [mockDatasourceId]: string = '12e74246-a3f1-46c1-9fd9-8d952aa9f12f';

describe('useErrorLogger', () => {
	const wrapper: RenderHookOptions<{}>['wrapper'] = ({ children }) => (
		<AnalyticsListener channel={EVENT_CHANNEL} onEvent={onAnalyticFireEvent}>
			{children}
		</AnalyticsListener>
	);

	const setup = (loggerProps?: UseErrorLoggerProps) => {
		const { result, waitForNextUpdate, rerender } = renderHook(
			() => {
				return useErrorLogger(loggerProps ?? { datasourceId: mockDatasourceId });
			},
			{ wrapper },
		);

		return {
			result,
			waitForNextUpdate,
			rerender,
		};
	};

	beforeEach(() => {
		asMock(onAnalyticFireEvent).mockReset();
		asMock(captureException).mockReset();
	});

	it('does not call captureException with failed response', () => {
		const { result } = setup();

		const response = new Response(null, {
			status: 500,
			headers: { 'x-trace-id': 'mock-trace-id' },
		});

		result.current.captureError('someFunction', response);

		expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
			{
				payload: {
					action: 'operationFailed',
					actionSubject: 'datasource',
					eventType: 'operational',
					attributes: {
						errorLocation: 'someFunction',
						status: 500,
						traceId: 'mock-trace-id',
					},
				},
			},
			EVENT_CHANNEL,
		);
		expect(captureException).toHaveBeenCalledTimes(0);
	});

	ffTest.off(
		'platform.linking-platform.datasources.enable-sentry-client',
		'when sentry client not enabled',
		() => {
			it('does not call captureException with error', () => {
				const { result } = setup();

				const mockError = new Error('mockError');

				result.current.captureError('someFunction', mockError);

				expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
					{
						payload: {
							action: 'operationFailed',
							actionSubject: 'datasource',
							eventType: 'operational',
							attributes: {
								errorLocation: 'someFunction',
								status: null,
								traceId: null,
							},
						},
					},
					EVENT_CHANNEL,
				);
				expect(captureException).toHaveBeenCalledTimes(0);
			});
		},
	);

	ffTest.on(
		'platform.linking-platform.datasources.enable-sentry-client',
		'when sentry client enabled',
		() => {
			it('should capture error exception', () => {
				const { result } = setup();

				const mockError = new Error('mockError');

				result.current.captureError('someFunction', mockError);

				expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
					{
						payload: {
							action: 'operationFailed',
							actionSubject: 'datasource',
							eventType: 'operational',
							attributes: {
								errorLocation: 'someFunction',
								status: null,
								traceId: null,
							},
						},
					},
					EVENT_CHANNEL,
				);
				expect(captureException).toHaveBeenCalledWith(mockError, 'link-datasource', {
					datasourceId: mockDatasourceId,
				});
			});

			it('should capture error exception with integrationKey ', () => {
				const { result } = setup({ integrationKey: 'test' });

				const mockError = new Error('mockError');

				result.current.captureError('someFunction', mockError);

				expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
					{
						payload: {
							action: 'operationFailed',
							actionSubject: 'datasource',
							eventType: 'operational',
							attributes: {
								errorLocation: 'someFunction',
								status: null,
								traceId: null,
							},
						},
					},
					EVENT_CHANNEL,
				);
				expect(captureException).toHaveBeenCalledWith(mockError, 'link-datasource', {
					integrationKey: 'test',
				});
			});
		},
	);
});
