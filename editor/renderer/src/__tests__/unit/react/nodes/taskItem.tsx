import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import FabricAnalyticsListener from '@atlaskit/analytics-listeners/FabricAnalyticsListeners';
import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners/types';
import TaskItem from '../../../../react/nodes/taskItem';
import ReactSerializer from '../../../../react';

describe('Renderer - React/Nodes/TaskItem', () => {
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

	it('should render the task as a checkbox with its content', () => {
		renderWithIntl(
			<TaskItem
				marks={[]}
				serializer={serialiser}
				nodeType="taskItem"
				dataAttributes={{ 'data-renderer-start-pos': 0 }}
				localId="task-1"
			>
				This is a task item
			</TaskItem>,
		);

		expect(screen.getByRole('checkbox')).toBeInTheDocument();
		expect(screen.getByText('This is a task item')).toBeInTheDocument();
	});

	it('should capture and report a11y violations', async () => {
		const { container } = renderWithIntl(
			<TaskItem
				marks={[]}
				serializer={serialiser}
				nodeType="taskItem"
				dataAttributes={{ 'data-renderer-start-pos': 0 }}
				localId="task-1"
			>
				This is a task item
			</TaskItem>,
		);

		await expect(container).toBeAccessible();
	});

	it('should render if no children', () => {
		renderWithIntl(
			<TaskItem
				marks={[]}
				serializer={serialiser}
				nodeType="taskItem"
				dataAttributes={{ 'data-renderer-start-pos': 0 }}
				localId="task-2"
			/>,
		);

		expect(screen.getByRole('checkbox')).toBeInTheDocument();
	});

	describe('analytics', () => {
		it('check action fires an event', async () => {
			renderWithIntl(
				<FabricAnalyticsListener client={analyticsWebClientMock}>
					<TaskItem
						marks={[]}
						serializer={serialiser}
						nodeType="taskItem"
						dataAttributes={{ 'data-renderer-start-pos': 0 }}
						localId="task-1"
					>
						Hello <b>world</b>
					</TaskItem>
				</FabricAnalyticsListener>,
			);

			await userEvent.click(screen.getByRole('checkbox'));

			expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledTimes(1);
			expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'checked',
					actionSubject: 'action',
					attributes: {
						localId: 'task-1',
						objectAri: '',
						userContext: 'document',
					},
				}),
			);
		});

		it('uncheck action fires an event', async () => {
			renderWithIntl(
				<FabricAnalyticsListener client={analyticsWebClientMock}>
					<TaskItem
						marks={[]}
						serializer={serialiser}
						nodeType="taskItem"
						dataAttributes={{ 'data-renderer-start-pos': 0 }}
						localId="task-1"
						state="DONE"
					>
						Hello <b>world</b>
					</TaskItem>
				</FabricAnalyticsListener>,
			);

			await userEvent.click(screen.getByRole('checkbox'));

			expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledTimes(1);
			expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'unchecked',
					actionSubject: 'action',
					attributes: {
						localId: 'task-1',
						objectAri: '',
						userContext: 'document',
					},
				}),
			);
		});
	});
});
