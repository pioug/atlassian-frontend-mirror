import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FabricAnalyticsListener, { type AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import TaskList from '../../../../react/nodes/taskList';
import TaskItem from '../../../../react/nodes/taskItem';
import ReactSerializer from '../../../../react';
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import { ffTest } from '@atlassian/feature-flags-test-utils';

describe('Renderer - React/Nodes/TaskList', () => {
	let analyticsWebClientMock: AnalyticsWebClient;
	const serialiser = new ReactSerializer({});

	beforeEach(() => {
		analyticsWebClientMock = {
			sendUIEvent: jest.fn(),
			sendOperationalEvent: jest.fn(),
			sendTrackEvent: jest.fn(),
			sendScreenEvent: jest.fn(),
		};
	});

	ffTest.on('editor_a11y_group_around_action_items', 'ffOn', () => {
		it('should wrap the task items in a group', () => {
			renderWithIntl(
				<TaskList localId="list-1">
					<TaskItem
						marks={[]}
						serializer={serialiser}
						nodeType="taskItem"
						dataAttributes={{ 'data-renderer-start-pos': 0 }}
						localId="task-1"
					>
						Hello <b>world</b>
					</TaskItem>
					<TaskItem
						marks={[]}
						serializer={serialiser}
						nodeType="taskItem"
						dataAttributes={{ 'data-renderer-start-pos': 0 }}
						localId="task-2"
					>
						Goodbye <b>world</b>
					</TaskItem>
				</TaskList>,
			);

			expect(screen.queryByRole('group', { name: 'Action Item List' })).toBeInTheDocument();
		});
	});

	ffTest.off('editor_a11y_group_around_action_items', 'ffOff', () => {
		it('should not wrap the task items in a group', () => {
			renderWithIntl(
				<TaskList localId="list-1">
					<TaskItem
						marks={[]}
						serializer={serialiser}
						nodeType="taskItem"
						dataAttributes={{ 'data-renderer-start-pos': 0 }}
						localId="task-1"
					>
						Hello <b>world</b>
					</TaskItem>
				</TaskList>,
			);

			expect(screen.queryByRole('group', { name: 'Action Item List' })).not.toBeInTheDocument();
		});
	});

	it('should not render if no children', () => {
		const { container } = renderWithIntl(<TaskList />);
		expect(container).toBeEmptyDOMElement();
	});

	describe('analytics', () => {
		it('check action fires an event', async () => {
			renderWithIntl(
				<FabricAnalyticsListener client={analyticsWebClientMock}>
					<TaskList localId="list-1">
						<TaskItem
							marks={[]}
							serializer={serialiser}
							nodeType="taskItem"
							dataAttributes={{ 'data-renderer-start-pos': 0 }}
							localId="task-1"
						>
							Hello <b>world</b>
						</TaskItem>
					</TaskList>
				</FabricAnalyticsListener>,
			);

			const checkbox = screen.getByRole('checkbox');
			await userEvent.click(checkbox);

			expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledTimes(1);
			expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'checked',
					actionSubject: 'action',
					attributes: {
						listLocalId: 'list-1',
						localId: 'task-1',
						objectAri: '',
						userContext: 'document',
						listSize: 1,
						position: 0,
					},
				}),
			);
		});

		it('uncheck action fires an event', async () => {
			renderWithIntl(
				<FabricAnalyticsListener client={analyticsWebClientMock}>
					<TaskList localId="list-1">
						<TaskItem
							marks={[]}
							serializer={serialiser}
							nodeType="taskItem"
							dataAttributes={{ 'data-renderer-start-pos': 0 }}
							localId="task-1"
						>
							Hello <b>world</b>
						</TaskItem>
						<TaskItem
							marks={[]}
							serializer={serialiser}
							nodeType="taskItem"
							dataAttributes={{ 'data-renderer-start-pos': 0 }}
							localId="task-2"
							state="DONE"
						>
							Goodbye <b>world</b>
						</TaskItem>
					</TaskList>
				</FabricAnalyticsListener>,
			);

			const checkboxes = screen.getAllByRole('checkbox');
			await userEvent.click(checkboxes[1]);

			expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledTimes(1);
			expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'unchecked',
					actionSubject: 'action',
					attributes: {
						listLocalId: 'list-1',
						localId: 'task-2',
						objectAri: '',
						userContext: 'document',
						listSize: 2,
						position: 1,
					},
				}),
			);
		});
	});
});
