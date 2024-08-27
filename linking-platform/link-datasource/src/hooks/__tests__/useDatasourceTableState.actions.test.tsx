import React from 'react';

import { renderHook, type RenderHookOptions } from '@testing-library/react-hooks';
import { defaultRegistry } from 'react-sweet-state';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import {
	mockActionsDiscoveryResponse,
	mockDatasourceDataResponse,
	mockDatasourceDataResponseWithSchema,
	useDatasourceClientExtension,
} from '@atlaskit/link-client-extension';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import { captureException } from '@atlaskit/linking-common/sentry';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { EVENT_CHANNEL } from '../../analytics';
import { Store } from '../../state';
import {
	type DatasourceTableStateProps,
	useDatasourceTableState,
} from '../useDatasourceTableState';

const mockDatasourceId: string = '12e74246-a3f1-46c1-9fd9-8d952aa9f12f';
const mockParameterValue: string = 'project=EDM';
const mockCloudId = 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b';
const onAnalyticFireEvent = jest.fn();

const wrapper: RenderHookOptions<{}>['wrapper'] = ({ children }) => (
	<AnalyticsListener channel={EVENT_CHANNEL} onEvent={onAnalyticFireEvent}>
		<SmartCardProvider client={new CardClient()}>{children}</SmartCardProvider>
	</AnalyticsListener>
);

jest.mock('@atlaskit/link-client-extension', () => {
	const originalModule = jest.requireActual('@atlaskit/link-client-extension');
	return {
		...originalModule,
		useDatasourceClientExtension: jest.fn(),
	};
});

jest.mock('@atlaskit/linking-common/sentry', () => {
	const originalModule = jest.requireActual('@atlaskit/linking-common/sentry');
	return {
		...originalModule,
		captureException: jest.fn(),
	};
});

describe('useDatasourceTableState', () => {
	let getDatasourceDetails: jest.Mock = jest.fn();
	let getDatasourceData: jest.Mock = jest.fn();
	let getDatasourceActionsAndPermissions: jest.Mock = jest.fn();
	const store = defaultRegistry.getStore(Store);

	const setup = (fields?: string[]) => {
		asMock(useDatasourceClientExtension).mockReturnValue({
			getDatasourceDetails,
			getDatasourceData,
			getDatasourceActionsAndPermissions,
		});

		const { result, waitForNextUpdate, rerender } = renderHook(
			({ fieldKeys, parameters, datasourceId }: Partial<DatasourceTableStateProps> = {}) =>
				useDatasourceTableState({
					datasourceId: datasourceId || mockDatasourceId,
					parameters: parameters || {
						cloudId: mockCloudId,
						jql: mockParameterValue,
					},
					fieldKeys: fieldKeys || fields,
				}),
			{ wrapper },
		);

		return {
			result,
			waitForNextUpdate,
			rerender,
		};
	};

	beforeEach(() => {
		jest.resetModules();
		store.storeState.resetState();
		getDatasourceData = jest.fn().mockResolvedValue(mockDatasourceDataResponse);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('with useDiscoverActions', () => {
		ffTest.on('enable_datasource_react_sweet_state', 'flag on', () => {
			ffTest.on('platform-datasources-enable-two-way-sync', 'flag on', () => {
				it('should fire analytic event when `discoverActions` is successful', async () => {
					asMock(getDatasourceData).mockResolvedValueOnce({
						...mockDatasourceDataResponseWithSchema,
					});
					asMock(getDatasourceActionsAndPermissions).mockResolvedValueOnce({
						...mockActionsDiscoveryResponse,
					});

					const { waitForNextUpdate } = setup();
					await waitForNextUpdate();

					expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
						{
							payload: {
								action: 'success',
								actionSubject: 'actionDiscovery',
								eventType: 'operational',
								attributes: {
									datasourceId: null,
									entityType: 'issue',
									experience: 'datasource',
									integrationKey: 'jira',
								},
							},
						},
						EVENT_CHANNEL,
					);
				});

				ffTest.off('platform.linking-platform.datasources.enable-sentry-client', 'flag on', () => {
					it('when `discoverActions` fails with an `Error`, it should log to Splunk and log to Sentry conditionally based on FF', async () => {
						const mockError = new Error('Mock error');
						asMock(getDatasourceData).mockResolvedValueOnce({
							...mockDatasourceDataResponseWithSchema,
						});
						asMock(getDatasourceActionsAndPermissions).mockRejectedValueOnce(mockError);

						const { waitForNextUpdate } = setup();
						await waitForNextUpdate();

						expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
							{
								payload: {
									action: 'operationFailed',
									actionSubject: 'datasource',
									eventType: 'operational',
									attributes: {
										errorLocation: 'actionDiscovery',
										status: null,
										traceId: null,
									},
								},
							},
							EVENT_CHANNEL,
						);
						expect(captureException).toHaveBeenCalledTimes(0);
					});
				});

				ffTest.on('platform.linking-platform.datasources.enable-sentry-client', 'flag off', () => {
					it('when `discoverActions` fails with an `Error`, it should log to Splunk and log to Sentry conditionally based on FF', async () => {
						const mockError = new Error('Mock error');
						asMock(getDatasourceData).mockResolvedValueOnce({
							...mockDatasourceDataResponseWithSchema,
						});
						asMock(getDatasourceActionsAndPermissions).mockRejectedValueOnce(mockError);

						const { waitForNextUpdate } = setup();
						await waitForNextUpdate();

						expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
							{
								payload: {
									action: 'operationFailed',
									actionSubject: 'datasource',
									eventType: 'operational',
									attributes: {
										errorLocation: 'actionDiscovery',
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
				});
			});
		});
	});
});
