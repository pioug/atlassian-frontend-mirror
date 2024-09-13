import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';
import { defaultRegistry } from 'react-sweet-state';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { FlagsProvider } from '@atlaskit/flag';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';

import { EVENT_CHANNEL } from '../../../../analytics';
import { Store, StoreContainer } from '../../../../state';
import { type DatasourceTypeWithOnlyValues } from '../../types';
import { InlineEdit } from '../inline-edit';
import '@atlaskit/link-test-helpers/jest';

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

const testJiraAri = 'ari:test:something:with:issue/123123';

describe('InlineEdit', () => {
	const setup = (props: React.ComponentProps<typeof InlineEdit>) => {
		render(
			<SmartCardProvider client={new CardClient()}>
				<IntlProvider locale="en">
					<AnalyticsListener channel={EVENT_CHANNEL} onEvent={onAnalyticFireEvent}>
						<FlagsProvider>
							<InlineEdit {...props} />,
						</FlagsProvider>
					</AnalyticsListener>
				</IntlProvider>
			</SmartCardProvider>,
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
					{store.storeState.getState().items[ari].data.summary.data}
				</div>
			</StoreContainer>
		);
	};

	const dataValues: DatasourceTypeWithOnlyValues = { type: 'string', values: ['Blahblah'] };

	it('should respond to the commit click and update the view and state when `execute` from `useExecuteAtomicAction` exists and its call resolves successfully', async () => {
		const execute = jest.fn().mockResolvedValue({});
		const ari = testJiraAri;
		store.storeState.setState({
			items: {
				[ari]: {
					ari,
					entityType: 'work-item',
					integrationKey: 'jira',
					data: {
						ari: { data: ari },
						summary: { data: 'Blahblah' },
					},
				},
			},
		});
		mockUseExecuteAtomicAction.mockReturnValue({ execute });

		setup({
			ari,
			columnKey: 'summary',
			execute,
			datasourceTypeWithValues: dataValues,
			readView: <MockReadView ari={ari} />,
		});

		expect(store.storeState.getState().items[ari].data.summary.data).toEqual('Blahblah');
		expect(screen.getByTestId(testIds.readView)).toHaveTextContent('Blahblah');
		await userEvent.click(screen.getByTestId(testIds.readView));

		expect(screen.getByTestId(testIds.editView)).toBeInTheDocument();

		await userEvent.clear(screen.getByTestId(testIds.editView));
		await userEvent.type(screen.getByTestId(testIds.editView), 'FoobarFoobar');
		await userEvent.type(screen.getByTestId(testIds.editView), '{enter}');

		expect(await screen.findByTestId(testIds.readView)).toHaveTextContent('FoobarFoobar');
		expect(store.storeState.getState().items[ari].data.summary.data).toEqual('FoobarFoobar');
	});

	it('should shows error flag when `execute` fails', async () => {
		const execute = jest.fn().mockRejectedValue({});
		const ari = testJiraAri;
		store.storeState.setState({
			items: {
				[ari]: {
					ari,
					entityType: 'work-item',
					integrationKey: 'jira',
					data: {
						ari: { data: ari },
						summary: { data: 'Blahblah' },
					},
				},
			},
		});
		mockUseExecuteAtomicAction.mockReturnValue({ execute });

		setup({
			ari,
			columnKey: 'summary',
			execute,
			datasourceTypeWithValues: dataValues,
			readView: <MockReadView ari={ari} />,
		});

		await userEvent.click(screen.getByTestId(testIds.readView));
		await userEvent.clear(screen.getByTestId(testIds.editView));
		await userEvent.type(screen.getByTestId(testIds.editView), 'FoobarFoobar');
		await userEvent.type(screen.getByTestId(testIds.editView), '{enter}');

		const flag = await screen.findByRole('alert');
		expect(flag).toBeInTheDocument();
	});

	it('should NOT update the view or state with an empty string', async () => {
		const execute = jest.fn().mockResolvedValue({});
		const ari = testJiraAri;
		store.storeState.setState({
			items: {
				[ari]: {
					ari,
					entityType: 'work-item',
					integrationKey: 'jira',
					data: {
						ari: { data: ari },
						summary: { data: 'Blahblah' },
					},
				},
			},
		});

		mockUseExecuteAtomicAction.mockReturnValue({ execute });

		setup({
			ari,
			columnKey: 'summary',
			execute,
			datasourceTypeWithValues: dataValues,
			readView: <MockReadView ari={ari} />,
		});

		expect(store.storeState.getState().items[ari].data.summary.data).toEqual('Blahblah');
		expect(screen.getByTestId(testIds.readView)).toHaveTextContent('Blahblah');
		await userEvent.click(screen.getByTestId(testIds.readView));

		expect(screen.getByTestId(testIds.editView)).toBeInTheDocument();
		await userEvent.clear(screen.getByTestId(testIds.editView));
		await userEvent.type(screen.getByTestId(testIds.editView), '{enter}');

		expect(execute).not.toHaveBeenCalled();
		expect(screen.queryByTestId(testIds.editView)).not.toBeInTheDocument();
		expect(store.storeState.getState().items[ari].data.summary.data).toEqual('Blahblah');
		expect(screen.getByTestId(testIds.readView)).toHaveTextContent('Blahblah');
	});

	it('should NOT update the view or state with the same string', async () => {
		const execute = jest.fn().mockResolvedValue({});
		const ari = testJiraAri;
		store.storeState.setState({
			items: {
				[ari]: {
					ari,
					entityType: 'work-item',
					integrationKey: 'jira',
					data: {
						ari: { data: ari },
						summary: { data: 'Blahblah' },
					},
				},
			},
		});

		mockUseExecuteAtomicAction.mockReturnValue({ execute });

		setup({
			ari,
			columnKey: 'summary',
			execute,
			datasourceTypeWithValues: dataValues,
			readView: <MockReadView ari={ari} />,
		});

		expect(store.storeState.getState().items[ari].data.summary.data).toEqual('Blahblah');
		expect(screen.getByTestId(testIds.readView)).toHaveTextContent('Blahblah');
		await userEvent.click(screen.getByTestId(testIds.readView));

		expect(screen.getByTestId(testIds.editView)).toBeInTheDocument();
		await userEvent.clear(screen.getByTestId(testIds.editView));
		await userEvent.type(screen.getByTestId(testIds.editView), 'Blahblah');
		await userEvent.type(screen.getByTestId(testIds.editView), '{enter}');

		expect(execute).not.toHaveBeenCalled();
		expect(screen.queryByTestId(testIds.editView)).not.toBeInTheDocument();
		expect(store.storeState.getState().items[ari].data.summary.data).toEqual('Blahblah');
		expect(screen.getByTestId(testIds.readView)).toHaveTextContent('Blahblah');
	});

	it('should NOT update the view or state on Blur', async () => {
		const execute = jest.fn().mockResolvedValue({});
		const ari = testJiraAri;
		store.storeState.setState({
			items: {
				[ari]: {
					ari,
					entityType: 'work-item',
					integrationKey: 'jira',
					data: {
						ari: { data: ari },
						summary: { data: 'Blahblah' },
					},
				},
			},
		});

		mockUseExecuteAtomicAction.mockReturnValue({ execute });

		setup({
			ari,
			columnKey: 'summary',
			execute,
			datasourceTypeWithValues: dataValues,
			readView: <MockReadView ari={ari} />,
		});

		expect(store.storeState.getState().items[ari].data.summary.data).toEqual('Blahblah');
		expect(screen.getByTestId(testIds.readView)).toHaveTextContent('Blahblah');
		await userEvent.click(screen.getByTestId(testIds.readView));

		expect(screen.getByTestId(testIds.editView)).toBeInTheDocument();
		await userEvent.type(screen.getByTestId(testIds.editView), '{Esc}');

		expect(execute).not.toHaveBeenCalled();
		expect(screen.queryByTestId(testIds.editView)).not.toBeInTheDocument();
		expect(store.storeState.getState().items[ari].data.summary.data).toEqual('Blahblah');
		expect(screen.getByTestId(testIds.readView)).toHaveTextContent('Blahblah');
	});

	describe('analytics', () => {
		it('fires ui.inlineEdit.clicked.datasource on inline edit click', async () => {
			const execute = jest.fn().mockResolvedValue({});
			const ari = testJiraAri;
			store.storeState.setState({
				items: {
					[ari]: {
						ari,
						entityType: 'work-item',
						integrationKey: 'jira',
						data: {
							ari: { data: ari },
							summary: { data: 'Blahblah' },
						},
					},
				},
			});
			mockUseExecuteAtomicAction.mockReturnValue({ execute });

			const dataValues: DatasourceTypeWithOnlyValues = { type: 'string', values: ['Blahblah'] };

			setup({
				ari,
				columnKey: 'summary',
				execute,
				datasourceTypeWithValues: dataValues,
				readView: <MockReadView ari={ari} />,
			});

			await userEvent.click(screen.getByTestId(testIds.readView));

			expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
				{
					payload: {
						eventType: 'ui',
						action: 'clicked',
						actionSubject: 'inlineEdit',
						actionSubjectId: 'datasource',
						attributes: {
							entityType: 'work-item',
							fieldKey: 'summary',
							integrationKey: 'jira',
						},
					},
				},
				'media',
			);
		});

		it('fires ui.inlineEdit.cancelled.datasource on inline edit cancel', async () => {
			const execute = jest.fn().mockResolvedValue({});
			const ari = testJiraAri;
			store.storeState.setState({
				items: {
					[ari]: {
						ari,
						entityType: 'work-item',
						integrationKey: 'jira',
						data: {
							ari: { data: ari },
							summary: { data: 'Blahblah' },
						},
					},
				},
			});
			mockUseExecuteAtomicAction.mockReturnValue({ execute });

			const dataValues: DatasourceTypeWithOnlyValues = { type: 'string', values: ['Blahblah'] };

			setup({
				ari,
				columnKey: 'summary',
				execute,
				datasourceTypeWithValues: dataValues,
				readView: <MockReadView ari={ari} />,
			});

			await userEvent.click(screen.getByTestId(testIds.readView));

			expect(screen.getByTestId(testIds.editView)).toBeInTheDocument();
			await userEvent.type(screen.getByTestId(testIds.editView), '{Esc}');

			expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
				{
					payload: {
						eventType: 'ui',
						action: 'clicked',
						actionSubject: 'inlineEdit',
						actionSubjectId: 'datasource',
						attributes: {
							entityType: 'work-item',
							fieldKey: 'summary',
							integrationKey: 'jira',
						},
					},
				},
				'media',
			);
			expect(onAnalyticFireEvent).not.toBeFiredWithAnalyticEventOnce(
				{
					payload: {
						action: 'submitted',
						actionSubject: 'form',
						actionSubjectId: 'inlineEdit',
						attributes: {},
						eventType: 'ui',
					},
				},
				EVENT_CHANNEL,
			);
		});

		it('should not fire ui.form.submitted.inlineEdit event when update is invalid', async () => {
			const execute = jest.fn().mockResolvedValue({});
			const ari = testJiraAri;
			store.storeState.setState({
				items: {
					[ari]: {
						ari,
						entityType: 'work-item',
						integrationKey: 'jira',
						data: {
							ari: { data: ari },
							summary: { data: 'Blahblah' },
						},
					},
				},
			});

			mockUseExecuteAtomicAction.mockReturnValue({ execute });

			setup({
				ari,
				columnKey: 'summary',
				execute,
				datasourceTypeWithValues: dataValues,
				readView: <MockReadView ari={ari} />,
			});

			expect(store.storeState.getState().items[ari].data.summary.data).toEqual('Blahblah');
			expect(screen.getByTestId(testIds.readView)).toHaveTextContent('Blahblah');
			await userEvent.click(screen.getByTestId(testIds.readView));

			expect(screen.getByTestId(testIds.editView)).toBeInTheDocument();
			await userEvent.clear(screen.getByTestId(testIds.editView));
			await userEvent.type(screen.getByTestId(testIds.editView), 'Blahblah');
			await userEvent.type(screen.getByTestId(testIds.editView), '{enter}');

			expect(onAnalyticFireEvent).not.toBeFiredWithAnalyticEventOnce(
				{
					payload: {
						action: 'submitted',
						actionSubject: 'form',
						actionSubjectId: 'inlineEdit',
						attributes: {},
						eventType: 'ui',
					},
				},
				EVENT_CHANNEL,
			);
		});

		it('should fire ui.form.submitted.inlineEdit event when update is valid but fails', async () => {
			const execute = jest.fn().mockRejectedValue({});
			const ari = testJiraAri;
			store.storeState.setState({
				items: {
					[ari]: {
						ari,
						entityType: 'work-item',
						integrationKey: 'jira',
						data: {
							ari: { data: ari },
							summary: { data: 'Blahblah' },
						},
					},
				},
			});
			mockUseExecuteAtomicAction.mockReturnValue({ execute });

			setup({
				ari,
				columnKey: 'summary',
				execute,
				datasourceTypeWithValues: dataValues,
				readView: <MockReadView ari={ari} />,
			});

			await userEvent.click(screen.getByTestId(testIds.readView));
			await userEvent.clear(screen.getByTestId(testIds.editView));
			await userEvent.type(screen.getByTestId(testIds.editView), 'FoobarFoobar');
			await userEvent.type(screen.getByTestId(testIds.editView), '{enter}');

			expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
				{
					payload: {
						action: 'submitted',
						actionSubject: 'form',
						actionSubjectId: 'inlineEdit',
						attributes: {},
						eventType: 'ui',
					},
				},
				EVENT_CHANNEL,
			);
		});

		it('should fire ui.form.submitted.inlineEdit event when update succeeds', async () => {
			const execute = jest.fn().mockResolvedValue({});
			const ari = testJiraAri;
			store.storeState.setState({
				items: {
					[ari]: {
						ari,
						entityType: 'work-item',
						integrationKey: 'jira',
						data: {
							ari: { data: ari },
							summary: { data: 'Blahblah' },
						},
					},
				},
			});
			mockUseExecuteAtomicAction.mockReturnValue({ execute });

			setup({
				ari,
				columnKey: 'summary',
				execute,
				datasourceTypeWithValues: dataValues,
				readView: <MockReadView ari={ari} />,
			});

			expect(store.storeState.getState().items[ari].data.summary.data).toEqual('Blahblah');
			expect(screen.getByTestId(testIds.readView)).toHaveTextContent('Blahblah');
			await userEvent.click(screen.getByTestId(testIds.readView));

			expect(screen.getByTestId(testIds.editView)).toBeInTheDocument();

			await userEvent.clear(screen.getByTestId(testIds.editView));
			await userEvent.type(screen.getByTestId(testIds.editView), 'FoobarFoobar');
			await userEvent.type(screen.getByTestId(testIds.editView), '{enter}');

			expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
				{
					payload: {
						action: 'submitted',
						actionSubject: 'form',
						actionSubjectId: 'inlineEdit',
						attributes: {},
						eventType: 'ui',
					},
				},
				EVENT_CHANNEL,
			);
		});
	});
});
