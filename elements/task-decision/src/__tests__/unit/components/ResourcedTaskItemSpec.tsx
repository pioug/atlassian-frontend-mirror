import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FabricAnalyticsListener, { type AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { waitUntil } from '@atlaskit/elements-test-helpers';
import ResourcedTaskItem from '../../../components/ResourcedTaskItem';
import { type TaskDecisionProvider } from '../../../types';
import { asMock } from '../_mock';
import { ffTest } from '@atlassian/feature-flags-test-utils';

describe('<ResourcedTaskItem/>', () => {
	let provider: TaskDecisionProvider;
	let analyticsWebClientMock: AnalyticsWebClient;

	beforeEach(() => {
		provider = {
			subscribe: jest.fn(),
			unsubscribe: jest.fn(),
			// @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
			//See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
			toggleTask: jest.fn(() => Promise.resolve(true)),
			unsubscribeRecentUpdates: jest.fn(),
			notifyRecentUpdates: jest.fn(),
		};
		analyticsWebClientMock = {
			sendUIEvent: jest.fn(),
			sendOperationalEvent: jest.fn(),
			sendTrackEvent: jest.fn(),
			sendScreenEvent: jest.fn(),
		};
	});

	ffTest.on('platform_editor_css_migrate_stage_1', 'with fg on', () => {
		it('should wrap TaskItem', () => {
			render(
				<ResourcedTaskItem taskId="task-1" objectAri="objectAri">
					Hello World
				</ResourcedTaskItem>,
			);
			const checkbox = screen.getByRole('checkbox');
			expect(checkbox).toBeInTheDocument();
		});

		it('should render callback with ref', () => {
			let contentRef: HTMLElement | null = null;
			const handleContentRef = (ref: HTMLElement | null) => (contentRef = ref);
			render(
				<ResourcedTaskItem taskId="task-id" objectAri="objectAri" contentRef={handleContentRef}>
					Hello <b>world</b>
				</ResourcedTaskItem>,
			);
			expect(contentRef).not.toEqual(null);
			expect(contentRef).toHaveTextContent('Hello world');
		});

		it('should call onChange prop in change handling if no provider', async () => {
			const spy = jest.fn();
			render(
				<ResourcedTaskItem taskId="task-id" objectAri="objectAri" onChange={spy}>
					Hello <b>world</b>
				</ResourcedTaskItem>,
			);
			const checkbox = screen.getByRole('checkbox');
			await userEvent.click(checkbox);
			expect(spy).toHaveBeenCalled();
		});

		it('should call onChange prop in change handling if provider', async () => {
			const spy = jest.fn();
			render(
				<ResourcedTaskItem
					taskId="task-id"
					objectAri="objectAri"
					onChange={spy}
					taskDecisionProvider={Promise.resolve(provider)}
				>
					Hello <b>world</b>
				</ResourcedTaskItem>,
			);
			const checkbox = screen.getByRole('checkbox');
			await userEvent.click(checkbox);
			await waitUntil(() => asMock(provider.toggleTask).mock.calls.length);
			expect(spy).toHaveBeenCalled();
		});

		it('should still toggle isDone of TaskItem onChange without objectAri', async () => {
			render(
				<ResourcedTaskItem taskId="task-1" isDone={false}>
					Hello World
				</ResourcedTaskItem>,
			);
			const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
			await userEvent.click(checkbox);
			expect(checkbox.checked).toBe(true);
		});

		it("should update ResourcedTaskItem 'component's `state.isDone` to match refreshed `props.isDone`", () => {
			const resultRender = render(
				<ResourcedTaskItem taskId="task-1" isDone={true}>
					Hello World
				</ResourcedTaskItem>,
			);

			const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
			expect(checkbox.checked).toBe(true);
			expect(screen.queryByText('Hello World')).toBeInTheDocument();
			expect(screen.queryByText('Hello Universe')).not.toBeInTheDocument();

			// Change the props and re-render. This simulates a document refresh.
			// (e.g. the client refreshes _potentially_ stale top level document data from a remote location).
			resultRender.rerender(
				<ResourcedTaskItem taskId="task-1" isDone={false}>
					Hello Universe
				</ResourcedTaskItem>,
			);

			expect(checkbox.checked).toBe(false);
			expect(screen.queryByText('Hello World')).not.toBeInTheDocument();
			expect(screen.queryByText('Hello Universe')).toBeInTheDocument();
		});

		it("should not update ResourcedTaskItem 'component's `state.isDone` when `props.isDone` is not changing", async () => {
			const resultRender = render(
				<ResourcedTaskItem taskId="task-1" isDone={true}>
					Hello World
				</ResourcedTaskItem>,
			);
			const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
			expect(checkbox.checked).toBe(true);

			await userEvent.click(checkbox);
			expect(checkbox.checked).toBe(false);
			expect(screen.queryByText('Hello World')).toBeInTheDocument();
			expect(screen.queryByText('Hello Universe')).not.toBeInTheDocument();

			// Change the props and re-render. This simulates a document refresh.
			// (e.g. the client refreshes _potentially_ stale top level document data from a remote location).
			resultRender.rerender(
				<ResourcedTaskItem taskId="task-1" isDone={true}>
					Hello Universe
				</ResourcedTaskItem>,
			);

			expect(checkbox.checked).toBe(false);
			expect(screen.queryByText('Hello World')).not.toBeInTheDocument();
			expect(screen.queryByText('Hello Universe')).toBeInTheDocument();
		});

		it('should not disable taskItem if no provider', () => {
			render(
				<ResourcedTaskItem taskId="task-1" isDone={false}>
					Hello World
				</ResourcedTaskItem>,
			);
			const checkbox = screen.getByRole('checkbox');
			expect(checkbox).not.toBeDisabled();
		});

		it('should subscribe to updates', async () => {
			render(
				<ResourcedTaskItem
					taskId="task-1"
					objectAri="objectAri"
					taskDecisionProvider={Promise.resolve(provider)}
				>
					Hello World
				</ResourcedTaskItem>,
			);
			await waitUntil(() => (provider.subscribe as jest.Mock).mock.calls.length).then(() => {
				expect(provider.subscribe).toBeCalled();
			});
		});

		it('should update on subscription callback to updates', async () => {
			const resultRender = render(
				<ResourcedTaskItem
					taskId="task-1"
					objectAri="objectAri"
					taskDecisionProvider={Promise.resolve(provider)}
					isDone={false}
				>
					Hello World
				</ResourcedTaskItem>,
			);

			await waitUntil(() => asMock(provider.subscribe).mock.calls.length);
			expect(provider.subscribe).toBeCalled();
			const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
			expect(checkbox.checked).toBe(false);

			const subscribeCallback = asMock(provider.subscribe).mock.calls[0][1];
			subscribeCallback('DONE');

			resultRender.rerender(
				<ResourcedTaskItem
					taskId="task-1"
					objectAri="objectAri"
					taskDecisionProvider={Promise.resolve(provider)}
					isDone={false}
				>
					Hello World
				</ResourcedTaskItem>,
			);

			expect(checkbox.checked).toBe(true);
		});

		it('should call "toggleTask" when toggled', async () => {
			render(
				<ResourcedTaskItem
					taskId="task-1"
					objectAri="objectAri"
					taskDecisionProvider={Promise.resolve(provider)}
				>
					Hello World
				</ResourcedTaskItem>,
			);
			const checkbox = screen.getByRole('checkbox');
			await userEvent.click(checkbox);

			return waitUntil(() => asMock(provider.toggleTask).mock.calls.length).then(() => {
				expect(provider.toggleTask).toBeCalled();
			});
		});

		describe('showPlaceholder', () => {
			it('should render placeholder if task is empty', () => {
				render(
					<ResourcedTaskItem
						taskId="task-1"
						objectAri="objectAri"
						showPlaceholder={true}
						placeholder="cheese"
						taskDecisionProvider={Promise.resolve(provider)}
					/>,
				);
				expect(screen.queryByTestId('task-decision-item-placeholder')).toBeInTheDocument();
			});

			it('should not render placeholder task if not empty', () => {
				render(
					<ResourcedTaskItem
						taskId="task-1"
						objectAri="objectAri"
						showPlaceholder={true}
						placeholder="cheese"
						taskDecisionProvider={Promise.resolve(provider)}
					>
						Hello <b>world</b>
					</ResourcedTaskItem>,
				);
				expect(screen.queryByTestId('task-decision-item-placeholder')).not.toBeInTheDocument();
			});
		});

		describe('analytics', () => {
			it('check action fires an event', async () => {
				render(
					<FabricAnalyticsListener client={analyticsWebClientMock}>
						<ResourcedTaskItem taskId="task-1" objectAri="objectAri">
							Hello <b>world</b>
						</ResourcedTaskItem>
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
							localId: 'task-1',
							objectAri: 'objectAri',
						},
					}),
				);
			});

			it('uncheck action fires an event', async () => {
				render(
					<FabricAnalyticsListener client={analyticsWebClientMock}>
						<ResourcedTaskItem taskId="task-1" objectAri="objectAri" isDone={true}>
							Hello <b>world</b>
						</ResourcedTaskItem>
					</FabricAnalyticsListener>,
				);
				const checkbox = screen.getByRole('checkbox');
				await userEvent.click(checkbox);
				expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledTimes(1);
				expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						action: 'unchecked',
						actionSubject: 'action',
						attributes: {
							localId: 'task-1',
							objectAri: 'objectAri',
						},
					}),
				);
			});
		});
	});

	ffTest.off('platform_editor_css_migrate_stage_1', 'with fg off', () => {
		it('should wrap TaskItem', () => {
			render(
				<ResourcedTaskItem taskId="task-1" objectAri="objectAri">
					Hello World
				</ResourcedTaskItem>,
			);
			const checkbox = screen.getByRole('checkbox');
			expect(checkbox).toBeInTheDocument();
		});

		it('should render callback with ref', () => {
			let contentRef: HTMLElement | null = null;
			const handleContentRef = (ref: HTMLElement | null) => (contentRef = ref);
			render(
				<ResourcedTaskItem taskId="task-id" objectAri="objectAri" contentRef={handleContentRef}>
					Hello <b>world</b>
				</ResourcedTaskItem>,
			);
			expect(contentRef).not.toEqual(null);
			expect(contentRef).toHaveTextContent('Hello world');
		});

		it('should call onChange prop in change handling if no provider', async () => {
			const spy = jest.fn();
			render(
				<ResourcedTaskItem taskId="task-id" objectAri="objectAri" onChange={spy}>
					Hello <b>world</b>
				</ResourcedTaskItem>,
			);
			const checkbox = screen.getByRole('checkbox');
			await userEvent.click(checkbox);
			expect(spy).toHaveBeenCalled();
		});

		it('should call onChange prop in change handling if provider', async () => {
			const spy = jest.fn();
			render(
				<ResourcedTaskItem
					taskId="task-id"
					objectAri="objectAri"
					onChange={spy}
					taskDecisionProvider={Promise.resolve(provider)}
				>
					Hello <b>world</b>
				</ResourcedTaskItem>,
			);
			const checkbox = screen.getByRole('checkbox');
			await userEvent.click(checkbox);
			await waitUntil(() => asMock(provider.toggleTask).mock.calls.length);
			expect(spy).toHaveBeenCalled();
		});

		it('should still toggle isDone of TaskItem onChange without objectAri', async () => {
			render(
				<ResourcedTaskItem taskId="task-1" isDone={false}>
					Hello World
				</ResourcedTaskItem>,
			);
			const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
			await userEvent.click(checkbox);
			expect(checkbox.checked).toBe(true);
		});

		it("should update ResourcedTaskItem 'component's `state.isDone` to match refreshed `props.isDone`", () => {
			const resultRender = render(
				<ResourcedTaskItem taskId="task-1" isDone={true}>
					Hello World
				</ResourcedTaskItem>,
			);

			const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
			expect(checkbox.checked).toBe(true);
			expect(screen.queryByText('Hello World')).toBeInTheDocument();
			expect(screen.queryByText('Hello Universe')).not.toBeInTheDocument();

			// Change the props and re-render. This simulates a document refresh.
			// (e.g. the client refreshes _potentially_ stale top level document data from a remote location).
			resultRender.rerender(
				<ResourcedTaskItem taskId="task-1" isDone={false}>
					Hello Universe
				</ResourcedTaskItem>,
			);

			expect(checkbox.checked).toBe(false);
			expect(screen.queryByText('Hello World')).not.toBeInTheDocument();
			expect(screen.queryByText('Hello Universe')).toBeInTheDocument();
		});

		it("should not update ResourcedTaskItem 'component's `state.isDone` when `props.isDone` is not changing", async () => {
			const resultRender = render(
				<ResourcedTaskItem taskId="task-1" isDone={true}>
					Hello World
				</ResourcedTaskItem>,
			);
			const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
			expect(checkbox.checked).toBe(true);

			await userEvent.click(checkbox);
			expect(checkbox.checked).toBe(false);
			expect(screen.queryByText('Hello World')).toBeInTheDocument();
			expect(screen.queryByText('Hello Universe')).not.toBeInTheDocument();

			// Change the props and re-render. This simulates a document refresh.
			// (e.g. the client refreshes _potentially_ stale top level document data from a remote location).
			resultRender.rerender(
				<ResourcedTaskItem taskId="task-1" isDone={true}>
					Hello Universe
				</ResourcedTaskItem>,
			);

			expect(checkbox.checked).toBe(false);
			expect(screen.queryByText('Hello World')).not.toBeInTheDocument();
			expect(screen.queryByText('Hello Universe')).toBeInTheDocument();
		});

		it('should not disable taskItem if no provider', () => {
			render(
				<ResourcedTaskItem taskId="task-1" isDone={false}>
					Hello World
				</ResourcedTaskItem>,
			);
			const checkbox = screen.getByRole('checkbox');
			expect(checkbox).not.toBeDisabled();
		});

		it('should subscribe to updates', async () => {
			render(
				<ResourcedTaskItem
					taskId="task-1"
					objectAri="objectAri"
					taskDecisionProvider={Promise.resolve(provider)}
				>
					Hello World
				</ResourcedTaskItem>,
			);
			await waitUntil(() => (provider.subscribe as jest.Mock).mock.calls.length).then(() => {
				expect(provider.subscribe).toBeCalled();
			});
		});

		it('should update on subscription callback to updates', async () => {
			const resultRender = render(
				<ResourcedTaskItem
					taskId="task-1"
					objectAri="objectAri"
					taskDecisionProvider={Promise.resolve(provider)}
					isDone={false}
				>
					Hello World
				</ResourcedTaskItem>,
			);

			await waitUntil(() => asMock(provider.subscribe).mock.calls.length);
			expect(provider.subscribe).toBeCalled();
			const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
			expect(checkbox.checked).toBe(false);

			const subscribeCallback = asMock(provider.subscribe).mock.calls[0][1];
			subscribeCallback('DONE');

			resultRender.rerender(
				<ResourcedTaskItem
					taskId="task-1"
					objectAri="objectAri"
					taskDecisionProvider={Promise.resolve(provider)}
					isDone={false}
				>
					Hello World
				</ResourcedTaskItem>,
			);

			expect(checkbox.checked).toBe(true);
		});

		it('should call "toggleTask" when toggled', async () => {
			render(
				<ResourcedTaskItem
					taskId="task-1"
					objectAri="objectAri"
					taskDecisionProvider={Promise.resolve(provider)}
				>
					Hello World
				</ResourcedTaskItem>,
			);
			const checkbox = screen.getByRole('checkbox');
			await userEvent.click(checkbox);

			return waitUntil(() => asMock(provider.toggleTask).mock.calls.length).then(() => {
				expect(provider.toggleTask).toBeCalled();
			});
		});

		describe('showPlaceholder', () => {
			it('should render placeholder if task is empty', () => {
				render(
					<ResourcedTaskItem
						taskId="task-1"
						objectAri="objectAri"
						showPlaceholder={true}
						placeholder="cheese"
						taskDecisionProvider={Promise.resolve(provider)}
					/>,
				);
				expect(screen.queryByTestId('task-decision-item-placeholder')).toBeInTheDocument();
			});

			it('should not render placeholder task if not empty', () => {
				render(
					<ResourcedTaskItem
						taskId="task-1"
						objectAri="objectAri"
						showPlaceholder={true}
						placeholder="cheese"
						taskDecisionProvider={Promise.resolve(provider)}
					>
						Hello <b>world</b>
					</ResourcedTaskItem>,
				);
				expect(screen.queryByTestId('task-decision-item-placeholder')).not.toBeInTheDocument();
			});
		});

		describe('analytics', () => {
			it('check action fires an event', async () => {
				render(
					<FabricAnalyticsListener client={analyticsWebClientMock}>
						<ResourcedTaskItem taskId="task-1" objectAri="objectAri">
							Hello <b>world</b>
						</ResourcedTaskItem>
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
							localId: 'task-1',
							objectAri: 'objectAri',
						},
					}),
				);
			});

			it('uncheck action fires an event', async () => {
				render(
					<FabricAnalyticsListener client={analyticsWebClientMock}>
						<ResourcedTaskItem taskId="task-1" objectAri="objectAri" isDone={true}>
							Hello <b>world</b>
						</ResourcedTaskItem>
					</FabricAnalyticsListener>,
				);
				const checkbox = screen.getByRole('checkbox');
				await userEvent.click(checkbox);
				expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledTimes(1);
				expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						action: 'unchecked',
						actionSubject: 'action',
						attributes: {
							localId: 'task-1',
							objectAri: 'objectAri',
						},
					}),
				);
			});
		});
	});
});
