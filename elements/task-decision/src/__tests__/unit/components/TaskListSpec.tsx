import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { mount } from 'enzyme';
import FabricAnalyticsListener, { type AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { TaskList, TaskItem } from '../../../';

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
		const component = mount(
			<IntlProvider locale="en">
				<TaskList>
					<TaskItem taskId="task-1">1</TaskItem>
					<TaskItem taskId="task-2">2</TaskItem>
				</TaskList>
			</IntlProvider>,
		);
		expect(component.find(TaskItem).length).toEqual(2);
	});

	it('should render single TaskItem', () => {
		const component = mount(
			<IntlProvider locale="en">
				<TaskList>
					<TaskItem taskId="task-1">1</TaskItem>
				</TaskList>
			</IntlProvider>,
		);
		expect(component.find(TaskItem).length).toEqual(1);
	});

	it("shouldn't render list when no items", () => {
		const component = mount(
			<IntlProvider locale="en">
				<TaskList />
			</IntlProvider>,
		);
		expect(component.find('ol').length).toEqual(0);
		expect(component.find('li').length).toEqual(0);
		expect(component.find(TaskItem).length).toEqual(0);
	});

	it('should include data attributes on ol/li', () => {
		const component = mount(
			<IntlProvider locale="en">
				<TaskList>
					<TaskItem taskId="task-1">1</TaskItem>
				</TaskList>
			</IntlProvider>,
		);
		const divs = component.find('div');
		expect(divs.length).toEqual(4);
		expect(divs.first().prop('data-task-list-local-id')).toEqual('');

		expect(component.find('div[data-task-local-id]').length).toEqual(1);

		expect(component.find('div[data-task-local-id]').prop('data-task-local-id')).toEqual('');
	});

	describe('analytics', () => {
		it('check action fires an event', () => {
			const component = mount(
				<IntlProvider locale="en">
					<FabricAnalyticsListener client={analyticsWebClientMock}>
						<TaskList listId="list-1">
							<TaskItem taskId="task-1">
								Hello <b>world</b>
							</TaskItem>
						</TaskList>
					</FabricAnalyticsListener>
				</IntlProvider>,
			);
			component.find('input').simulate('change');
			expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledTimes(1);
			expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'checked',
					actionSubject: 'action',
					attributes: {
						listLocalId: 'list-1',
						position: 0,
						listSize: 1,
						localId: 'task-1',
					},
				}),
			);
		});

		it('uncheck action fires an event', () => {
			const component = mount(
				<IntlProvider locale="en">
					<FabricAnalyticsListener client={analyticsWebClientMock}>
						<TaskList listId="list-1">
							<TaskItem taskId="task-1" isDone={false}>
								Hello <b>world</b>
							</TaskItem>
							<TaskItem taskId="task-2" isDone={true}>
								Goodbye <b>world</b>
							</TaskItem>
						</TaskList>
					</FabricAnalyticsListener>
				</IntlProvider>,
			);
			component.find('input').at(1).simulate('change');
			expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledTimes(1);
			expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'unchecked',
					actionSubject: 'action',
					attributes: {
						listLocalId: 'list-1',
						position: 1,
						listSize: 2,
						localId: 'task-2',
					},
				}),
			);
		});
	});
});
