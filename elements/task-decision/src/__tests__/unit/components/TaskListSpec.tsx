import React from 'react';

import { fireEvent, screen } from '@testing-library/react';

import FabricAnalyticsListener from '@atlaskit/analytics-listeners/FabricAnalyticsListeners';
import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners/types';

import { TaskList, TaskItem } from '../../../';
import { renderWithIntl } from '../_testing-library';

describe('<TaskList/>', () => {
	let analyticsWebClientMock: AnalyticsWebClient;

	beforeEach(() => {
		analyticsWebClientMock = {
			sendUIEvent: jest.fn(),
			sendOperationalEvent: jest.fn(),
			sendTrackEvent: jest.fn(),
			sendScreenEvent: jest.fn(),
		};
	});

	it('should render all TaskItems', () => {
		renderWithIntl(
			<TaskList>
				<TaskItem taskId="task-1">1</TaskItem>
				<TaskItem taskId="task-2">2</TaskItem>
			</TaskList>,
		);

		expect(screen.getByRole('group', { name: 'Action Item List' })).toBeInTheDocument();
		expect(screen.getByText('1')).toBeInTheDocument();
		expect(screen.getByText('2')).toBeInTheDocument();
	});

	it('should render single TaskItem', () => {
		renderWithIntl(
			<TaskList>
				<TaskItem taskId="task-1">1</TaskItem>
			</TaskList>,
		);

		expect(screen.getByRole('group', { name: 'Action Item List' })).toBeInTheDocument();
	});

	it("shouldn't render list when no items", () => {
		renderWithIntl(<TaskList />);

		expect(screen.queryByRole('group', { name: 'Action Item List' })).not.toBeInTheDocument();
	});

	it('should include data attributes on ol/li', () => {
		renderWithIntl(
			<TaskList>
				<TaskItem taskId="task-1">1</TaskItem>
			</TaskList>,
		);

		const list = screen.getByRole('group', { name: 'Action Item List' });
		expect(list).toHaveAttribute('data-task-list-local-id', '');
		expect(screen.getByRole('checkbox')).toBeInTheDocument();
	});

	describe('analytics', () => {
		it('check action fires an event', () => {
			renderWithIntl(
				<FabricAnalyticsListener client={analyticsWebClientMock}>
					<TaskList listId="list-1">
						<TaskItem taskId="task-1">
							Hello <b>world</b>
						</TaskItem>
					</TaskList>
				</FabricAnalyticsListener>,
			);

			fireEvent.click(screen.getByRole('checkbox'));
			expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledTimes(1);
			expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'checked',
					actionSubject: 'action',
					attributes: { listLocalId: 'list-1', position: 0, listSize: 1, localId: 'task-1' },
				}),
			);
		});

		it('uncheck action fires an event', () => {
			renderWithIntl(
				<FabricAnalyticsListener client={analyticsWebClientMock}>
					<TaskList listId="list-1">
						<TaskItem taskId="task-1" isDone={false}>
							Hello <b>world</b>
						</TaskItem>
						<TaskItem taskId="task-2" isDone={true}>
							Goodbye <b>world</b>
						</TaskItem>
					</TaskList>
				</FabricAnalyticsListener>,
			);

			fireEvent.click(screen.getAllByRole('checkbox')[1]);
			expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledTimes(1);
			expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'unchecked',
					actionSubject: 'action',
					attributes: { listLocalId: 'list-1', position: 1, listSize: 2, localId: 'task-2' },
				}),
			);
		});
	});
});
