import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import { defaultRegistry } from 'react-sweet-state';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { FlagsProvider } from '@atlaskit/flag';
import { captureException } from '@atlaskit/linking-common/sentry';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { EVENT_CHANNEL } from '../../../../analytics';
import { Store, StoreContainer } from '../../../../state';
import { type DatasourceTypeWithOnlyValues } from '../../types';
import { InlineEdit } from '../inline-edit';

const store = defaultRegistry.getStore(Store);
const onAnalyticFireEvent = jest.fn();

let mockUseExecuteAtomicAction = jest.fn();

jest.mock('../../../../state/actions', () => {
	return {
		__esModule: true,
		...jest.requireActual('../../../../state/actions'),
		useExecuteAtomicAction: () => mockUseExecuteAtomicAction(),
	};
});

jest.mock('@atlaskit/linking-common/sentry', () => {
	const originalModule = jest.requireActual('@atlaskit/linking-common/sentry');
	return {
		...originalModule,
		captureException: jest.fn(),
	};
});

const testIds = {
	readView: 'mock-read-view',
	editView: 'inline-edit-text',
};

describe('InlineEdit', () => {
	const setup = (props: React.ComponentProps<typeof InlineEdit>) => {
		render(
			<IntlProvider locale="en">
				<AnalyticsListener channel={EVENT_CHANNEL} onEvent={onAnalyticFireEvent}>
					<FlagsProvider>
						<InlineEdit {...props} />,
					</FlagsProvider>
				</AnalyticsListener>
			</IntlProvider>,
		);
	};

	beforeEach(() => {
		store.storeState.resetState();
		mockUseExecuteAtomicAction.mockClear();
		onAnalyticFireEvent.mockReset();
	});

	const MockReadView = ({ ari }: { ari: string }) => {
		return (
			<StoreContainer>
				<div data-testid={testIds.readView}>
					{store.storeState.getState().items[ari].data.date.data}
				</div>
			</StoreContainer>
		);
	};

	it('should respond to the commit click and update the view and state when `execute` from `useExecuteAtomicAction` exists and its call resolves successfully', () => {
		const execute = jest.fn().mockResolvedValue({});
		const ari = 'ari/test';
		store.storeState.setState({
			items: {
				[ari]: {
					ari,
					integrationKey: 'jira',
					data: {
						ari: { data: ari },
						date: { data: 'Blahblah' },
					},
				},
			},
		});
		mockUseExecuteAtomicAction.mockReturnValue({ execute });

		const dataValues: DatasourceTypeWithOnlyValues = { type: 'string', values: ['Blahblah'] };

		setup({
			ari,
			columnKey: 'date',
			execute,
			integrationKey: 'jira',
			datasourceTypeWithValues: dataValues,
			readView: <MockReadView ari={ari} />,
		});

		expect(store.storeState.getState().items[ari].data.date.data).toEqual('Blahblah');
		expect(screen.getByTestId(testIds.readView)).toHaveTextContent('Blahblah');
		fireEvent.click(screen.getByTestId(testIds.readView));

		expect(screen.getByTestId(testIds.editView)).toBeInTheDocument();

		fireEvent.change(screen.getByTestId(testIds.editView), { target: { value: 'FoobarFoobar' } });
		fireEvent.submit(screen.getByTestId(testIds.editView));

		expect(store.storeState.getState().items[ari].data.date.data).toEqual('FoobarFoobar');
		expect(screen.getByTestId(testIds.readView)).toHaveTextContent('FoobarFoobar');
	});

	it('should shows error flag when `execute` fails', async () => {
		const execute = jest.fn().mockRejectedValue({});
		const ari = 'ari/test';
		store.storeState.setState({
			items: {
				[ari]: {
					ari,
					integrationKey: 'jira',
					data: {
						ari: { data: ari },
						date: { data: 'Blahblah' },
					},
				},
			},
		});
		mockUseExecuteAtomicAction.mockReturnValue({ execute });

		const dataValues: DatasourceTypeWithOnlyValues = { type: 'string', values: ['Blahblah'] };

		setup({
			ari,
			columnKey: 'date',
			execute,
			integrationKey: 'jira',
			datasourceTypeWithValues: dataValues,
			readView: <MockReadView ari={ari} />,
		});

		fireEvent.click(screen.getByTestId(testIds.readView));
		fireEvent.change(screen.getByTestId(testIds.editView), { target: { value: 'FoobarFoobar' } });
		fireEvent.submit(screen.getByTestId(testIds.editView));

		const flag = await screen.findByRole('alert');
		expect(flag).toBeInTheDocument();
	});

	it('should NOT update the view or state with an empty string', () => {
		const execute = jest.fn().mockResolvedValue({});
		const ari = 'ari/test';
		store.storeState.setState({
			items: {
				[ari]: {
					ari,
					integrationKey: 'jira',
					data: {
						ari: { data: ari },
						date: { data: 'Blahblah' },
					},
				},
			},
		});

		mockUseExecuteAtomicAction.mockReturnValue({ execute });

		const dataValues: DatasourceTypeWithOnlyValues = { type: 'string', values: ['Blahblah'] };

		setup({
			ari,
			columnKey: 'date',
			execute,
			integrationKey: 'jira',
			datasourceTypeWithValues: dataValues,
			readView: <MockReadView ari={ari} />,
		});

		expect(store.storeState.getState().items[ari].data.date.data).toEqual('Blahblah');
		expect(screen.getByTestId(testIds.readView)).toHaveTextContent('Blahblah');
		fireEvent.click(screen.getByTestId(testIds.readView));

		expect(screen.getByTestId(testIds.editView)).toBeInTheDocument();
		fireEvent.change(screen.getByTestId(testIds.editView), { target: { value: '' } });
		fireEvent.submit(screen.getByTestId(testIds.editView));

		expect(execute).not.toHaveBeenCalled();
		expect(screen.queryByTestId(testIds.editView)).not.toBeInTheDocument();
		expect(store.storeState.getState().items[ari].data.date.data).toEqual('Blahblah');
		expect(screen.getByTestId(testIds.readView)).toHaveTextContent('Blahblah');
	});

	it('should NOT update the view or state on Blur', () => {
		const execute = jest.fn().mockResolvedValue({});
		const ari = 'ari/test';
		store.storeState.setState({
			items: {
				[ari]: {
					ari,
					integrationKey: 'jira',
					data: {
						ari: { data: ari },
						date: { data: 'Blahblah' },
					},
				},
			},
		});

		mockUseExecuteAtomicAction.mockReturnValue({ execute });

		const dataValues: DatasourceTypeWithOnlyValues = { type: 'string', values: ['Blahblah'] };

		setup({
			ari,
			columnKey: 'date',
			execute,
			integrationKey: 'jira',
			datasourceTypeWithValues: dataValues,
			readView: <MockReadView ari={ari} />,
		});

		expect(store.storeState.getState().items[ari].data.date.data).toEqual('Blahblah');
		expect(screen.getByTestId(testIds.readView)).toHaveTextContent('Blahblah');
		fireEvent.click(screen.getByTestId(testIds.readView));

		expect(screen.getByTestId(testIds.editView)).toBeInTheDocument();
		fireEvent.keyDown(screen.getByTestId(testIds.editView), {
			key: 'Escape',
			code: 'Escape',
			keyCode: 27,
			charCode: 27,
		});

		expect(execute).not.toHaveBeenCalled();
		expect(screen.queryByTestId(testIds.editView)).not.toBeInTheDocument();
		expect(store.storeState.getState().items[ari].data.date.data).toEqual('Blahblah');
		expect(screen.getByTestId(testIds.readView)).toHaveTextContent('Blahblah');
	});

	it('should fire analytics event when `execute` fails', async () => {
		const ari = 'ari/test';
		store.storeState.setState({
			items: {
				[ari]: {
					ari,
					integrationKey: 'jira',
					data: {
						ari: { data: ari },
						date: { data: 'Blahblah' },
					},
				},
			},
		});
		const execute = jest.fn().mockRejectedValue(new Error('Async error'));
		mockUseExecuteAtomicAction.mockReturnValue({ execute });

		const dataValues: DatasourceTypeWithOnlyValues = { type: 'string', values: ['Blahblah'] };

		setup({
			ari,
			columnKey: 'date',
			execute,
			integrationKey: 'jira',
			datasourceTypeWithValues: dataValues,
			readView: <MockReadView ari={ari} />,
		});

		fireEvent.click(screen.getByTestId(testIds.readView));
		fireEvent.change(screen.getByTestId(testIds.editView), {
			target: { value: 'FoobarFoobar' },
		});
		fireEvent.submit(screen.getByTestId(testIds.editView));

		const flag = await screen.findByRole('alert');
		expect(flag).toBeInTheDocument();

		expect(onAnalyticFireEvent).toHaveBeenCalledWith(
			expect.objectContaining({
				payload: {
					action: 'operationFailed',
					actionSubject: 'datasource',
					eventType: 'operational',
					attributes: {
						errorLocation: 'actionExecution',
						status: null,
						traceId: null,
					},
				},
			}),
			EVENT_CHANNEL,
		);

		expect(captureException).toHaveBeenCalledTimes(0);
	});

	ffTest.on(
		'platform.linking-platform.datasources.enable-sentry-client',
		'with sentry client disabled',
		() => {
			it('should fire analytics event when `execute` fails', async () => {
				const ari = 'ari/test';
				store.storeState.setState({
					items: {
						[ari]: {
							ari,
							integrationKey: 'jira',
							data: {
								ari: { data: ari },
								date: { data: 'Blahblah' },
							},
						},
					},
				});
				const execute = jest.fn().mockRejectedValue(new Error('Async error'));
				mockUseExecuteAtomicAction.mockReturnValue({ execute });

				const dataValues: DatasourceTypeWithOnlyValues = { type: 'string', values: ['Blahblah'] };

				setup({
					ari,
					columnKey: 'date',
					execute,
					integrationKey: 'jira',
					datasourceTypeWithValues: dataValues,
					readView: <MockReadView ari={ari} />,
				});

				fireEvent.click(screen.getByTestId(testIds.readView));
				fireEvent.change(screen.getByTestId(testIds.editView), {
					target: { value: 'FoobarFoobar' },
				});
				fireEvent.submit(screen.getByTestId(testIds.editView));

				const flag = await screen.findByRole('alert');
				expect(flag).toBeInTheDocument();

				expect(onAnalyticFireEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						payload: {
							action: 'operationFailed',
							actionSubject: 'datasource',
							eventType: 'operational',
							attributes: {
								errorLocation: 'actionExecution',
								status: null,
								traceId: null,
							},
						},
					}),
					EVENT_CHANNEL,
				);

				expect(captureException).toHaveBeenCalledWith(
					new Error('Async error'),
					'link-datasource',
					expect.objectContaining({
						integrationKey: 'jira',
					}),
				);
			});
		},
	);
});
