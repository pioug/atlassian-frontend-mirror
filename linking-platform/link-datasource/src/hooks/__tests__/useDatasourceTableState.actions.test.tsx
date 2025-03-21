import React from 'react';

import { renderHook, type RenderHookOptions } from '@testing-library/react-hooks';
import { defaultRegistry } from 'react-sweet-state';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import {
	mockActionsDiscoveryResponse,
	mockDatasourceDataNoActionsResponse,
	mockDatasourceDataResponse,
	mockDatasourceDataResponseWithSchema,
	useDatasourceClientExtension,
} from '@atlaskit/link-client-extension';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import { captureException } from '@atlaskit/linking-common/sentry';

import { EVENT_CHANNEL } from '../../analytics';
import { Store } from '../../state';
import { ActionsStore } from '../../state/actions';
import {
	type DatasourceTableStateProps,
	useDatasourceTableState,
} from '../useDatasourceTableState';

const mockDatasourceId: string = '12e74246-a3f1-46c1-9fd9-8d952aa9f12f';
const mockParameterValue: string = 'project=EDM';
const mockCloudId = 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b';
const onAnalyticFireEvent = jest.fn();
const mockIsFedRamp: jest.Mock = jest.fn();

const wrapper: RenderHookOptions<{}>['wrapper'] = ({ children }) => (
	<AnalyticsListener channel={EVENT_CHANNEL} onEvent={onAnalyticFireEvent}>
		<SmartCardProvider client={new CardClient()}>{children}</SmartCardProvider>
	</AnalyticsListener>
);

jest.mock('@atlaskit/atlassian-context', () => {
	const originalModule = jest.requireActual('@atlaskit/atlassian-context');
	return {
		...originalModule,
		isFedRamp: () => mockIsFedRamp(),
	};
});

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
	const actionsStore = defaultRegistry.getStore(ActionsStore);

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
		actionsStore.storeState.resetState();
		getDatasourceData = jest.fn().mockResolvedValue(mockDatasourceDataResponse);
		mockIsFedRamp.mockReturnValue(false);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('with useDiscoverActions', () => {
		it('should not call discovery when determined to be in FedRamp environment', async () => {
			asMock(getDatasourceData).mockResolvedValueOnce({
				...mockDatasourceDataResponseWithSchema,
			});
			mockIsFedRamp.mockReturnValueOnce(true);

			const { waitForNextUpdate } = setup();
			await waitForNextUpdate();

			expect(getDatasourceActionsAndPermissions).not.toHaveBeenCalled();
		});

		it('should call discovery when determined to be non FedRamp environment', async () => {
			asMock(getDatasourceData).mockResolvedValueOnce({
				...mockDatasourceDataResponseWithSchema,
			});
			asMock(getDatasourceActionsAndPermissions).mockResolvedValueOnce({
				...mockActionsDiscoveryResponse,
			});
			mockIsFedRamp.mockReturnValueOnce(false);

			const { waitForNextUpdate } = setup();
			await waitForNextUpdate();

			expect(getDatasourceActionsAndPermissions).toHaveBeenCalled();
		});

		it('should not call discovery when objectTypesEntity is not in the datasource response', async () => {
			asMock(getDatasourceData).mockResolvedValueOnce({
				...mockDatasourceDataNoActionsResponse,
			});
			const { waitForNextUpdate } = setup();
			await waitForNextUpdate();

			expect(getDatasourceActionsAndPermissions).not.toHaveBeenCalled();
		});

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
							entityType: 'work-item',
							experience: 'datasource',
							integrationKey: 'jira',
						},
					},
				},
				EVENT_CHANNEL,
			);
		});

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
							reason: 'internal',
						},
					},
				},
				EVENT_CHANNEL,
			);
			expect(captureException).toHaveBeenCalledWith(mockError, 'link-datasource', {
				datasourceId: mockDatasourceId,
			});
		});

		it('should include fetchAction in the state when they are available', async () => {
			asMock(getDatasourceData).mockResolvedValueOnce({
				...mockDatasourceDataResponseWithSchema,
			});

			asMock(getDatasourceActionsAndPermissions).mockResolvedValueOnce({
				...mockActionsDiscoveryResponse,
			});

			const { waitForNextUpdate } = setup();
			await waitForNextUpdate();

			const actions = actionsStore.storeState.getState();

			expect(actions['actionsByIntegration']['jira']).toEqual(
				expect.objectContaining({
					status: {
						actionKey: 'atlassian:work-item:update:status',
						fetchAction: {
							actionKey: 'atlassian:work-item:get:statuses',
							inputs: {
								issueId: {
									type: 'string',
								},
							},
							type: 'string',
						},
						type: 'string',
					},
				}),
			);
		});
	});
});
