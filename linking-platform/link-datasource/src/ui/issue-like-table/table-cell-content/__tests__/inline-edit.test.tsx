import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';
import { defaultRegistry } from 'react-sweet-state';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { FlagsProvider } from '@atlaskit/flag';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';

import { EVENT_CHANNEL } from '../../../../analytics';
import { DatasourceExperienceIdProvider } from '../../../../contexts/datasource-experience-id';
import { Store, StoreContainer } from '../../../../state';
import { type DatasourceTypeWithOnlyValues } from '../../types';
import { getFieldLabelById } from '../../utils';
import { InlineEdit, newGetBackendUpdateValue } from '../inline-edit';
import '@atlaskit/link-test-helpers/jest';
import { tableCellMessages } from '../messages';

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
		return render(
			<SmartCardProvider client={new CardClient()}>
				<IntlProvider locale="en">
					<AnalyticsListener channel={EVENT_CHANNEL} onEvent={onAnalyticFireEvent}>
						<FlagsProvider>
							<DatasourceExperienceIdProvider>
								<table>
									<thead>
										<tr>
											<th id={getFieldLabelById(props.columnKey)}>Label of the field</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>
												<InlineEdit {...props} />,
											</td>
										</tr>
									</tbody>
								</table>
							</DatasourceExperienceIdProvider>
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
					{String(store.storeState.getState().items[ari].data.summary.data)}
				</div>
			</StoreContainer>
		);
	};

	const dataValues: DatasourceTypeWithOnlyValues = { type: 'string', values: ['Blahblah'] };

	it.each([
		['user', 'assignee'],
		['status', 'status'],
		['icon', 'priority'],
		['string', 'summary'],
	])('should capture and report a11y violations for %s fields', async (columnKey, columnTitle) => {
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

		const selectSource = {
			type: columnKey as 'user' | 'status' | 'icon' | 'string',
			values: [],
		};

		const result = setup({
			ari,
			columnKey,
			columnTitle,
			execute,
			datasourceTypeWithValues: selectSource,
			readView: <MockReadView ari={ari} />,
		});

		await expect(result.container).toBeAccessible();

		await userEvent.click(
			screen.getByRole('button', {
				name: (fieldName) =>
					fieldName.includes(
						tableCellMessages.editButtonLabel.defaultMessage
							.replace(/\{fieldValue\}/gi, '')
							.replace(/\{fieldName\}/gi, columnTitle),
					),
			}),
		);

		await expect(result.container).toBeAccessible();
	});

	// This ensures that the id value is not changed to ensure filterTransaction works in packages/editor/editor-plugin-card/src/pm-plugins/main.ts
	it('should have correct id value for when in edit view for prosemirror transaction filtering', async () => {
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
			columnTitle: 'summary',
			execute,
			datasourceTypeWithValues: dataValues,
			readView: <MockReadView ari={ari} />,
		});
		expect(store.storeState.getState().items[ari].data.summary.data).toEqual('Blahblah');
		expect(screen.getByTestId(testIds.readView)).toHaveTextContent('Blahblah');
		await userEvent.click(screen.getByTestId(testIds.readView));

		const editView = screen.getByTestId(testIds.editView);
		expect(editView).toBeInTheDocument();
		expect(editView.id).toEqual('sllv-active-inline-edit');
	});

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
			columnTitle: 'summary',
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
			columnTitle: 'summary',
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
			columnTitle: 'summary',
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
			columnTitle: 'summary',
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
			columnTitle: 'summary',
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
				columnTitle: 'summary',
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
				columnTitle: 'summary',
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
				columnTitle: 'summary',
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
				columnTitle: 'summary',
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
				columnTitle: 'summary',
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

describe('newGetBackendUpdateValue', () => {
	describe('icon', () => {
		it('should return the id for type "icon"', () => {
			const iconTypeInput: DatasourceTypeWithOnlyValues = {
				type: 'icon',
				values: [
					{
						source: 'icon-source',
						label: 'icon-label',
						text: 'icon-text',
						id: 'icon-id',
					},
				],
			};
			expect(newGetBackendUpdateValue(iconTypeInput)).toBe('icon-id');
		});

		it('should throw an error if id is not supplied for type "icon"', () => {
			const iconTypeInput: DatasourceTypeWithOnlyValues = {
				type: 'icon',
				values: [
					{
						source: 'icon-source',
						label: 'icon-label',
						text: 'icon-text',
					},
				],
			};
			expect(() => newGetBackendUpdateValue(iconTypeInput)).toThrow(
				'Datasource 2 way sync: Backend update ID not supplied for type icon',
			);
		});
		it('should throw an error if id is an empty string for type "icon"', () => {
			const iconTypeInput: DatasourceTypeWithOnlyValues = {
				type: 'icon',
				values: [
					{
						source: 'icon-source',
						label: 'icon-label',
						text: 'icon-text',
						id: '',
					},
				],
			};
			expect(() => newGetBackendUpdateValue(iconTypeInput)).toThrow(
				'Datasource 2 way sync: Backend update ID not supplied for type icon',
			);
		});
	});

	describe('string', () => {
		it('should return the string value for type "string"', () => {
			const stringTypeInput: DatasourceTypeWithOnlyValues = {
				type: 'string',
				values: ['test-value'],
			};
			expect(newGetBackendUpdateValue(stringTypeInput)).toBe('test-value');
		});

		it('should throw an error if no values are supplied for type "string"', () => {
			const stringTypeInput: DatasourceTypeWithOnlyValues = {
				type: 'string',
				values: [],
			};
			expect(() => newGetBackendUpdateValue(stringTypeInput)).toThrow(
				'Datasource 2 way sync: Backend update value or value ID not supplied for type string',
			);
		});
		it('should not throw an error if the value is an empty string for type "string"', () => {
			const stringTypeInput: DatasourceTypeWithOnlyValues = {
				type: 'string',
				values: [''],
			};
			expect(newGetBackendUpdateValue(stringTypeInput)).toBe('');
		});
	});

	describe('status', () => {
		it('should return the transitionId for type "status"', () => {
			const statusTypeInput: DatasourceTypeWithOnlyValues = {
				type: 'status',
				values: [{ transitionId: 'status-id', text: 'text' }],
			};
			expect(newGetBackendUpdateValue(statusTypeInput)).toBe('status-id');
		});

		it('should throw an error if transitionId is not supplied for type "status"', () => {
			const statusTypeInput: DatasourceTypeWithOnlyValues = {
				type: 'status',
				values: [{ text: 'text' }],
			};
			expect(() => newGetBackendUpdateValue(statusTypeInput)).toThrow(
				'Datasource 2 way sync: Backend status transition ID not supplied for type transition',
			);
		});
		it('should throw an error if transitionId is an emtpy string for type "status"', () => {
			const statusTypeInput: DatasourceTypeWithOnlyValues = {
				type: 'status',
				values: [{ transitionId: '', text: 'text' }],
			};
			expect(() => newGetBackendUpdateValue(statusTypeInput)).toThrow(
				'Datasource 2 way sync: Backend status transition ID not supplied for type transition',
			);
		});
	});

	describe('user', () => {
		it('should return the atlassianUserId for type "user"', () => {
			const userTypeInput: DatasourceTypeWithOnlyValues = {
				type: 'user',
				values: [{ atlassianUserId: 'user-id' }],
			};
			expect(newGetBackendUpdateValue(userTypeInput)).toBe('user-id');
		});

		it('should throw an error if atlassianUserId is not supplied for type "user"', () => {
			const userTypeInput: DatasourceTypeWithOnlyValues = {
				type: 'user',
				values: [{}],
			};
			expect(() => newGetBackendUpdateValue(userTypeInput)).toThrow(
				'Datasource 2 way sync: Backend atlasian user ID not supplied for type user',
			);
		});
	});
});
