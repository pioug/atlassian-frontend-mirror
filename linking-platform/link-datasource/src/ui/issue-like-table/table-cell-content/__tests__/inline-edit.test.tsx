import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import { defaultRegistry } from 'react-sweet-state';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { FlagsProvider } from '@atlaskit/flag';

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
		fireEvent.click(screen.getByTestId(testIds.readView));

		expect(screen.getByTestId(testIds.editView)).toBeInTheDocument();

		fireEvent.change(screen.getByTestId(testIds.editView), { target: { value: 'FoobarFoobar' } });
		fireEvent.submit(screen.getByTestId(testIds.editView));

		expect(await screen.findByTestId(testIds.readView)).toHaveTextContent('FoobarFoobar');
		expect(store.storeState.getState().items[ari].data.summary.data).toEqual('FoobarFoobar');

		// Analytic event should be fired on successful update
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

		fireEvent.click(screen.getByTestId(testIds.readView));
		fireEvent.change(screen.getByTestId(testIds.editView), { target: { value: 'FoobarFoobar' } });
		fireEvent.submit(screen.getByTestId(testIds.editView));

		const flag = await screen.findByRole('alert');
		expect(flag).toBeInTheDocument();

		// Analytic event should be fired on valid update that failed
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

	it('should NOT update the view or state with an empty string', () => {
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
		fireEvent.click(screen.getByTestId(testIds.readView));

		expect(screen.getByTestId(testIds.editView)).toBeInTheDocument();
		fireEvent.change(screen.getByTestId(testIds.editView), { target: { value: '' } });
		fireEvent.submit(screen.getByTestId(testIds.editView));

		expect(execute).not.toHaveBeenCalled();
		expect(screen.queryByTestId(testIds.editView)).not.toBeInTheDocument();
		expect(store.storeState.getState().items[ari].data.summary.data).toEqual('Blahblah');
		expect(screen.getByTestId(testIds.readView)).toHaveTextContent('Blahblah');

		// No analytic event should be fired when update is invalid so no form submission occurs
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

	it('should NOT update the view or state with the same string', () => {
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
		fireEvent.click(screen.getByTestId(testIds.readView));

		expect(screen.getByTestId(testIds.editView)).toBeInTheDocument();
		fireEvent.change(screen.getByTestId(testIds.editView), { target: { value: 'Blahblah' } });
		fireEvent.submit(screen.getByTestId(testIds.editView));

		expect(execute).not.toHaveBeenCalled();
		expect(screen.queryByTestId(testIds.editView)).not.toBeInTheDocument();
		expect(store.storeState.getState().items[ari].data.summary.data).toEqual('Blahblah');
		expect(screen.getByTestId(testIds.readView)).toHaveTextContent('Blahblah');

		// No analytic event should be fired when update is invalid so no form submission occurs
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

	it('should NOT update the view or state on Blur', () => {
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
		expect(store.storeState.getState().items[ari].data.summary.data).toEqual('Blahblah');
		expect(screen.getByTestId(testIds.readView)).toHaveTextContent('Blahblah');

		// No analytic event should be fired when aborting form submission
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

	describe('analytics', () => {
		it('fires ui.inlineEdit.clicked.datasource on inline edit click', () => {
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

			fireEvent.click(screen.getByTestId(testIds.readView));

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
	});
});
