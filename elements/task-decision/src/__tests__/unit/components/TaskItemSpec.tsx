import React from 'react';
import { mount } from 'enzyme';
import FabricAnalyticsListener, { type AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { TaskItem } from '../../../';
import { ffTest } from '@atlassian/feature-flags-test-utils';

describe('<TaskItem/>', () => {
	let analyticsWebClientMock: AnalyticsWebClient;

	beforeEach(() => {
		analyticsWebClientMock = {
			sendUIEvent: jest.fn(),
			sendOperationalEvent: jest.fn(),
			sendTrackEvent: jest.fn(),
			sendScreenEvent: jest.fn(),
		};
	});

	ffTest.on('platform_editor_css_migrate_stage_1', 'with fg on', () => {
		it('should render children', () => {
			const component = mount(
				<TaskItem taskId="task-1">
					Hello <b>world</b>
				</TaskItem>,
			);
			expect(component.find('b').length).toEqual(1);
			expect(component.find('div[data-component="content"]').text()).toEqual('Hello world');
		});

		it('should render callback with ref', () => {
			let contentRef: HTMLElement | null = null;
			const handleContentRef = (ref: HTMLElement | null) => (contentRef = ref);
			const component = mount(
				<TaskItem taskId="task-id" contentRef={handleContentRef}>
					Hello <b>world</b>
				</TaskItem>,
			);
			expect(component.find('b').length).toEqual(1);
			expect(contentRef).not.toEqual(null);
			expect(contentRef!.textContent).toEqual('Hello world');
		});

		it('should disable input if disabled', () => {
			const component = mount(
				<TaskItem taskId="task-1" disabled={true}>
					Hello <b>world</b>
				</TaskItem>,
			);
			expect(component.find('input').prop('disabled')).toEqual(true);
		});

		describe('clicking', () => {
			it('should call onChange when checkbox is clicked', () => {
				const spy = jest.fn();
				const component = mount(
					<TaskItem taskId="task-1" onChange={spy}>
						Hello <b>world</b>
					</TaskItem>,
				);
				component.find('input').simulate('change');
				expect(spy).toHaveBeenCalledWith('task-1', true);
			});
		});

		describe('showPlaceholder', () => {
			it('should render placeholder if task is empty', () => {
				const component = mount(
					<TaskItem taskId="task-1" showPlaceholder={true} placeholder="cheese" />,
				);
				const placeholder = component.find('span[data-component="placeholder"]');
				expect(placeholder.text()).toEqual('cheese');
			});

			it('should not render placeholder if task is not empty', () => {
				const component = mount(
					<TaskItem taskId="task-1" showPlaceholder={true} placeholder="cheese">
						Hello <b>world</b>
					</TaskItem>,
				);
				expect(component.find('span[data-component="placeholder"]').length).toEqual(0);
			});
		});

		describe('analytics', () => {
			it('check action fires an event', () => {
				const component = mount(
					<FabricAnalyticsListener client={analyticsWebClientMock}>
						<TaskItem taskId="task-1" appearance="inline" isDone={false} />
					</FabricAnalyticsListener>,
				);
				component.find('input').simulate('change');
				expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledTimes(1);
				expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						action: 'checked',
						actionSubject: 'action',
						attributes: {
							localId: 'task-1',
						},
					}),
				);
			});

			it('uncheck action fires an event', () => {
				const component = mount(
					<FabricAnalyticsListener client={analyticsWebClientMock}>
						<TaskItem taskId="task-1" appearance="inline" isDone={true} />
					</FabricAnalyticsListener>,
				);
				component.find('input').simulate('change');
				expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledTimes(1);
				expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						action: 'unchecked',
						actionSubject: 'action',
						attributes: {
							localId: 'task-1',
						},
					}),
				);
			});
		});
	});

	ffTest.off('platform_editor_css_migrate_stage_1', 'with fg off', () => {
		it('should render children', () => {
			const component = mount(
				<TaskItem taskId="task-1">
					Hello <b>world</b>
				</TaskItem>,
			);
			expect(component.find('b').length).toEqual(1);
			expect(component.find('div[data-component="content"]').text()).toEqual('Hello world');
		});

		it('should render callback with ref', () => {
			let contentRef: HTMLElement | null = null;
			const handleContentRef = (ref: HTMLElement | null) => (contentRef = ref);
			const component = mount(
				<TaskItem taskId="task-id" contentRef={handleContentRef}>
					Hello <b>world</b>
				</TaskItem>,
			);
			expect(component.find('b').length).toEqual(1);
			expect(contentRef).not.toEqual(null);
			expect(contentRef!.textContent).toEqual('Hello world');
		});

		it('should disable input if disabled', () => {
			const component = mount(
				<TaskItem taskId="task-1" disabled={true}>
					Hello <b>world</b>
				</TaskItem>,
			);
			expect(component.find('input').prop('disabled')).toEqual(true);
		});

		describe('clicking', () => {
			it('should call onChange when checkbox is clicked', () => {
				const spy = jest.fn();
				const component = mount(
					<TaskItem taskId="task-1" onChange={spy}>
						Hello <b>world</b>
					</TaskItem>,
				);
				component.find('input').simulate('change');
				expect(spy).toHaveBeenCalledWith('task-1', true);
			});
		});

		describe('showPlaceholder', () => {
			it('should render placeholder if task is empty', () => {
				const component = mount(
					<TaskItem taskId="task-1" showPlaceholder={true} placeholder="cheese" />,
				);
				const placeholder = component.find('span[data-component="placeholder"]');
				expect(placeholder.text()).toEqual('cheese');
			});

			it('should not render placeholder if task is not empty', () => {
				const component = mount(
					<TaskItem taskId="task-1" showPlaceholder={true} placeholder="cheese">
						Hello <b>world</b>
					</TaskItem>,
				);
				expect(component.find('span[data-component="placeholder"]').length).toEqual(0);
			});
		});

		describe('analytics', () => {
			it('check action fires an event', () => {
				const component = mount(
					<FabricAnalyticsListener client={analyticsWebClientMock}>
						<TaskItem taskId="task-1" appearance="inline" isDone={false} />
					</FabricAnalyticsListener>,
				);
				component.find('input').simulate('change');
				expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledTimes(1);
				expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						action: 'checked',
						actionSubject: 'action',
						attributes: {
							localId: 'task-1',
						},
					}),
				);
			});

			it('uncheck action fires an event', () => {
				const component = mount(
					<FabricAnalyticsListener client={analyticsWebClientMock}>
						<TaskItem taskId="task-1" appearance="inline" isDone={true} />
					</FabricAnalyticsListener>,
				);
				component.find('input').simulate('change');
				expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledTimes(1);
				expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						action: 'unchecked',
						actionSubject: 'action',
						attributes: {
							localId: 'task-1',
						},
					}),
				);
			});
		});
	});
});
