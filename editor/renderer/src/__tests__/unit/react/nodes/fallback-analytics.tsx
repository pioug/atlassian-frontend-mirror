import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';

import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import Client from '@atlaskit/link-provider/client';
import { SmartCardProvider as Provider } from '@atlaskit/link-provider/smart-card-provider';
import { captureException } from '@atlaskit/linking-common/sentry';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';

import { CardErrorBoundary } from '../../../../react/nodes/fallback';

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
				<Provider client={new Client('staging')}>
					<CardErrorBoundary
						unsupportedComponent={MockedUnsupportedInline}
						isDatasource={true}
						{...args}
					>
						{renderComponent}
					</CardErrorBoundary>
				</Provider>
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

	it.each([undefined, 'javascript:alert(1)'])(
		'reports a failed datasource without a usable URL (%s)',
		async (url) => {
			mockExpEnabled('platform_editor_optional_chunk_recovery');
			const onEvent = await setup(<ErrorChild />, {
				datasourceId,
				url,
			});
			expect(screen.getByText('UnsupportedInline')).toBeVisible();
			expect(screen.queryByRole('link')).not.toBeInTheDocument();
			expect(onEvent).toHaveBeenCalledWith(
				expect.objectContaining(renderFailedPayload),
				EVENT_CHANNEL,
			);
		},
	);

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
			expect(onAnalyticFireEvent).toHaveBeenCalledWith(
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
			expect(onAnalyticFireEvent).toHaveBeenCalledWith(
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
			expect(onAnalyticFireEvent).toHaveBeenCalledWith(
				expect.objectContaining(renderFailedPayload),
				EVENT_CHANNEL,
			);
			expect(captureException).not.toHaveBeenCalled();
		});
	});
});
