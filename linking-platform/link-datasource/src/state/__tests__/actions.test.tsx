import React from 'react';

import { renderHook, type RenderHookOptions } from '@testing-library/react-hooks';
import { defaultRegistry } from 'react-sweet-state';

import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { captureException } from '@atlaskit/linking-common/sentry';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { ActionsStore, type ActionsStoreState, useExecuteAtomicAction } from '../actions';

const mockUseDatasourceClientExtension: jest.Mock = jest.fn();
const mockUseDatasourceAnalyticsEvents: jest.Mock = jest.fn();
const mockExecuteAction: jest.Mock = jest.fn();
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
			summary: { actionKey: 'atlassian:issue:update:summary', type: 'string' },
		},
	},
	permissions: {
		'some-test-ari': {
			summary: {
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
		mockUseDatasourceClientExtension.mockReturnValue({ executeAtomicAction: mockExecuteAction });
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

		it('should capture error when action fails with analytic event', async () => {
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
			});

			// Should not have logged to sentry
			expect(captureException).not.toHaveBeenCalled();
		});

		ffTest.on(
			'platform.linking-platform.datasources.enable-sentry-client',
			'with sentry client enabled',
			() => {
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
					});

					// Should have logged to sentry
					expect(captureException).toHaveBeenCalledWith(mockedError, 'link-datasource', {
						integrationKey: 'jira',
					});
				});
			},
		);
	});
});
