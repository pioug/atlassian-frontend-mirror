import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { CardErrorBoundary } from '../../../../react/nodes/fallback';
import { captureException } from '@atlaskit/linking-common/sentry';

jest.mock('@atlaskit/linking-common/sentry', () => {
	const originalModule = jest.requireActual('@atlaskit/link-client-extension');
	return {
		...originalModule,
		captureException: jest.fn(),
	};
});

const MockedUnsupportedInline = () => <div>UnsupportedInline</div>;
const url = 'https://extranet.atlassian.com/pages/viewpage.action?pageId=3088533424';
const datasourceId = 'mock-datasource-id';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Renderer - Fallback analytics', () => {
	const EVENT_CHANNEL = 'media';
	const mockError = new Error('Error');

	const renderFailedPayload = {
		payload: {
			action: 'renderFailure',
			actionSubject: 'datasource',
			actionSubjectId: undefined,
			attributes: {
				reason: 'internal',
			},
			eventType: 'operational',
		},
		context: [
			{
				component: 'datasource',
			},
		],
	};

	const setup = async (
		renderComponent: React.ReactNode,
		args?: {
			datasourceId?: string;
			url?: string;
		},
	) => {
		const onAnalyticFireEvent = jest.fn();

		render(
			<AnalyticsListener channel={EVENT_CHANNEL} onEvent={onAnalyticFireEvent}>
				<CardErrorBoundary
					unsupportedComponent={MockedUnsupportedInline}
					isDatasource={true}
					{...args}
				>
					{renderComponent}
				</CardErrorBoundary>
			</AnalyticsListener>,
		);

		await waitFor(() => {
			expect(onAnalyticFireEvent).toHaveBeenCalled();
		});

		return onAnalyticFireEvent;
	};

	const ErrorChild = () => {
		throw mockError;
	};

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('when error is caught by boundary and log to Sentry', () => {
		it('should fire datasource renderFailed event', async () => {
			const onAnalyticFireEvent = await setup(<ErrorChild />, {
				url,
				datasourceId,
			});
			await waitFor(() => {
				expect(captureException).toHaveBeenCalled();
			});
			expect(onAnalyticFireEvent).toHaveBeenCalledTimes(1);
			expect(onAnalyticFireEvent).toBeCalledWith(
				expect.objectContaining(renderFailedPayload),
				EVENT_CHANNEL,
			);
			expect(captureException).toHaveBeenCalledWith(mockError, 'link-datasource', {
				datasourceId,
			});
		});
	});

	describe('when error is caught by boundary, unsafe URL provided and log to Sentry', () => {
		it('should fire datasource renderFailed event', async () => {
			const unsafeUrl = 'javascript:alert(1)';

			const onAnalyticFireEvent = await setup(<ErrorChild />, {
				url: unsafeUrl,
				datasourceId,
			});
			await waitFor(() => {
				expect(captureException).toHaveBeenCalled();
			});
			expect(onAnalyticFireEvent).toHaveBeenCalledTimes(1);
			expect(onAnalyticFireEvent).toBeCalledWith(
				expect.objectContaining(renderFailedPayload),
				EVENT_CHANNEL,
			);
			expect(captureException).toHaveBeenCalledWith(mockError, 'link-datasource', {
				datasourceId,
			});
		});
	});

	describe('fires datasource renderFailed event when non error type is caught by boundary and do not log to Sentry', () => {
		it('regardless of sentry-client ff', async () => {
			const NonErrorChild = () => {
				// eslint-disable-next-line no-throw-literal
				throw { error: 'fake error message' };
			};
			const onAnalyticFireEvent = await setup(<NonErrorChild />, {
				url,
				datasourceId,
			});
			expect(onAnalyticFireEvent).toHaveBeenCalledTimes(1);
			expect(onAnalyticFireEvent).toBeCalledWith(
				expect.objectContaining(renderFailedPayload),
				EVENT_CHANNEL,
			);
			expect(captureException).not.toHaveBeenCalled();
		});
	});
});
