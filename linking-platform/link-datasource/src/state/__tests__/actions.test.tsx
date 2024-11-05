import React from 'react';

import { renderHook, type RenderHookOptions } from '@testing-library/react-hooks';
import { defaultRegistry } from 'react-sweet-state';

import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { captureException } from '@atlaskit/linking-common/sentry';

import { ActionsStore, type ActionsStoreState, useExecuteAtomicAction } from '../actions';

const mockUseDatasourceClientExtension: jest.Mock = jest.fn();
const mockUseDatasourceAnalyticsEvents: jest.Mock = jest.fn();
const mockExecuteAction: jest.Mock = jest.fn();
const mockInvalidateDatasourceDataCacheByAri: jest.Mock = jest.fn();
const mockFireEvent: jest.Mock = jest.fn();

jest.mock('@atlaskit/link-client-extension', () => {
	const originalModule = jest.requireActual('@atlaskit/link-client-extension');
	return {
		...originalModule,
		useDatasourceClientExtension: () => mockUseDatasourceClientExtension(),
	};
});

jest.mock('../../analytics', () => {
	const originalModule = jest.requireActual('../../analytics');
	return {
		...originalModule,
		useDatasourceAnalyticsEvents: () => mockUseDatasourceAnalyticsEvents(),
	};
});

jest.mock('@atlaskit/linking-common/sentry', () => {
	const originalModule = jest.requireActual('@atlaskit/linking-common/sentry');
	return {
		...originalModule,
		captureException: jest.fn(),
	};
});

const wrapper: RenderHookOptions<{}>['wrapper'] = ({ children }) => (
	<SmartCardProvider client={new CardClient()}>{children}</SmartCardProvider>
);

const actionsStore = defaultRegistry.getStore(ActionsStore);

const mockActionsStoreState: Partial<ActionsStoreState> = {
	actionsByIntegration: {
		jira: {
			summary: { actionKey: 'atlassian:work-item:update:summary', type: 'string' },
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
		},
	},
	permissions: {
		'some-test-ari': {
			summary: {
				isEditable: true,
			},
			status: {
				isEditable: true,
			},
		},
	},
};

const emptyActionsStoreState: Partial<ActionsStoreState> = {
	actionsByIntegration: {},
	permissions: {},
};

describe('useExecuteAtomicAction', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const setup = (
		overrideProps: { ari?: string; fieldKey?: string; integrationKey?: string } = {},
	) => {
		mockUseDatasourceClientExtension.mockReturnValue({
			executeAtomicAction: mockExecuteAction,
			invalidateDatasourceDataCacheByAri: mockInvalidateDatasourceDataCacheByAri,
		});
		mockUseDatasourceAnalyticsEvents.mockReturnValue({ fireEvent: mockFireEvent });

		const { result } = renderHook(
			() =>
				useExecuteAtomicAction({
					ari: 'some-test-ari',
					fieldKey: 'summary',
					integrationKey: 'jira',
					...overrideProps,
				}),
			{
				wrapper,
			},
		);

		return { result };
	};

	it('should return execute function if schema is present', () => {
		actionsStore.storeState.setState(mockActionsStoreState);
		const { result } = setup();
		expect(result.current.execute).not.toBe(undefined);
	});

	it('should not return execute function if no schema is present', () => {
		actionsStore.storeState.setState(emptyActionsStoreState);
		const { result } = setup();
		expect(result.current.execute).toBe(undefined);
	});

	it('should return execute and executeFetch function if both schemas are present', () => {
		actionsStore.storeState.setState(mockActionsStoreState);
		const { result } = setup({ fieldKey: 'status' });
		expect(result.current.execute).not.toBe(undefined);
		expect(result.current.executeFetch).not.toBe(undefined);
	});

	it('should not return executeFetch function if no fetchSchema is present', () => {
		actionsStore.storeState.setState(mockActionsStoreState);
		const { result } = setup();
		expect(result.current.executeFetch).toBe(undefined);
	});

	describe('analytics', () => {
		it('should fire event when executing action', async () => {
			actionsStore.storeState.setState(mockActionsStoreState);
			mockExecuteAction.mockResolvedValue({});

			const { result } = setup();

			const execute = result.current.execute;
			execute && (await execute('new summary'));
			expect(mockFireEvent).toHaveBeenCalledTimes(1);
			expect(mockFireEvent).toHaveBeenCalledWith('operational.actionExecution.success', {
				integrationKey: 'jira',
				experience: 'datasource',
			});
		});

		it('should NOT fire success analytics event when action fails', async () => {
			actionsStore.storeState.setState(mockActionsStoreState);
			const mockedError = new Error('some error');
			mockExecuteAction.mockRejectedValue(mockedError);

			const { result } = setup();

			const execute = result.current.execute;
			try {
				execute && (await execute('new summary'));
			} catch (err: any) {
				// Error although caught and logged should be rethrown
				expect(err.message).toBe('some error');
			}

			expect(mockFireEvent).not.toHaveBeenCalledWith('operational.actionExecution.success', {
				integrationKey: 'jira',
				experience: 'datasource',
			});
		});

		it('should capture error and fire analytics event AND log to sentry	when action fails', async () => {
			actionsStore.storeState.setState(mockActionsStoreState);
			const mockedError = new Error('some error');
			mockExecuteAction.mockRejectedValue(mockedError);

			const { result } = setup();

			const execute = result.current.execute;
			try {
				execute && (await execute('new summary'));
			} catch (err: any) {
				// Error although caught and logged should be rethrown
				expect(err.message).toBe('some error');
			}

			expect(mockFireEvent).toHaveBeenCalledWith('operational.datasource.operationFailed', {
				errorLocation: 'actionExecution',
				status: null,
				traceId: null,
				reason: 'internal',
			});

			// Should have logged to sentry
			expect(captureException).toHaveBeenCalledWith(mockedError, 'link-datasource', {
				integrationKey: 'jira',
			});
		});

		it('should fire event when executing fetch action', async () => {
			actionsStore.storeState.setState(mockActionsStoreState);
			mockExecuteAction.mockResolvedValue({});

			const { result } = setup({ fieldKey: 'status' });

			const executeFetch = result.current.executeFetch;
			executeFetch && (await executeFetch('new summary'));
			expect(mockFireEvent).toHaveBeenCalledTimes(1);
			expect(mockFireEvent).toHaveBeenCalledWith('operational.fetchActionExecution.success', {
				integrationKey: 'jira',
				experience: 'datasource',
			});
		});

		it('should NOT fire success analytics event when fetch action fails', async () => {
			actionsStore.storeState.setState(mockActionsStoreState);
			const mockedError = new Error('some error');
			mockExecuteAction.mockRejectedValue(mockedError);

			const { result } = setup({ fieldKey: 'status' });

			const executeFetch = result.current.executeFetch;
			try {
				executeFetch && (await executeFetch('new summary'));
			} catch (err: any) {
				// Error although caught and logged should be rethrown
				expect(err.message).toBe('some error');
			}

			expect(mockFireEvent).not.toHaveBeenCalledWith('operational.fetchActionExecution.success', {
				integrationKey: 'jira',
				experience: 'datasource',
			});
		});

		it('should capture error and fire analytics event AND log to sentry	when fetch action fails', async () => {
			actionsStore.storeState.setState(mockActionsStoreState);
			const mockedError = new Error('some error');
			mockExecuteAction.mockRejectedValue(mockedError);

			const { result } = setup({ fieldKey: 'status' });

			const executeFetch = result.current.executeFetch;
			try {
				executeFetch && (await executeFetch('new summary'));
			} catch (err: any) {
				// Error although caught and logged should be rethrown
				expect(err.message).toBe('some error');
			}

			expect(mockFireEvent).toHaveBeenCalledWith('operational.datasource.operationFailed', {
				errorLocation: 'fetchActionExecution',
				status: null,
				traceId: null,
				reason: 'internal',
			});

			// Should have logged to sentry
			expect(captureException).toHaveBeenCalledWith(mockedError, 'link-datasource', {
				integrationKey: 'jira',
			});
		});
	});
});
