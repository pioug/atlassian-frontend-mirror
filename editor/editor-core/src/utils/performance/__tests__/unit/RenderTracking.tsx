import React from 'react';

import MockDate from 'mockdate';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';

import { RenderTracking } from '../../components/RenderTracking';

type ComponentProps = {
	prop1?: string;
	prop2?: number;
	prop3?: any;
};

jest.useFakeTimers();
jest.unmock('lodash/debounce');

describe('RenderTracking', () => {
	let mockHandleAnalyticsEvent: jest.Mock;
	let container: HTMLElement | null = null;
	const startDateInMs = 0;
	const debounceInterval = 500;
	let root: any; // Change to Root once we go full React 18

	beforeEach(async () => {
		// setup a DOM element as a render target
		container = document.createElement('div');
		document.body.appendChild(container);
		if (process.env.IS_REACT_18 === 'true') {
			// @ts-ignore react-dom/client only available in react 18
			// eslint-disable-next-line @repo/internal/import/no-unresolved, import/dynamic-import-chunkname -- react-dom/client only available in react 18
			const { createRoot } = await import('react-dom/client');
			root = createRoot(container!);
		}

		mockHandleAnalyticsEvent = jest.fn();

		MockDate.set(startDateInMs);
	});

	afterEach(() => {
		// cleanup on exiting
		act(() => {
			if (process.env.IS_REACT_18 === 'true') {
				root.unmount();
			} else {
				unmountComponentAtNode(container!);
			}
		});
		if (container) {
			container.remove();
			container = null;
		}
		mockHandleAnalyticsEvent.mockRestore();
	});

	afterAll(() => {
		jest.useRealTimers();
	});

	const waitForDebounce = () => {
		act(() => {
			MockDate.set(startDateInMs + debounceInterval);
			jest.advanceTimersByTime(debounceInterval);
		});
	};

	it('should set render count to 0 on first render', async () => {
		if (process.env.IS_REACT_18 === 'true') {
			act(() => {
				root.render(
					<RenderTracking<ComponentProps>
						componentProps={{
							prop1: 'abc',
							prop2: 10,
							prop3: {
								prop31: {
									prop32: {},
								},
							},
						}}
						action={ACTION.RE_RENDERED}
						actionSubject={ACTION_SUBJECT.EDITOR}
						handleAnalyticsEvent={mockHandleAnalyticsEvent}
						propsToIgnore={[]}
						useShallow={false}
					/>,
				);
			});
		} else {
			act(() => {
				render(
					<RenderTracking<ComponentProps>
						componentProps={{
							prop1: 'abc',
							prop2: 10,
							prop3: {
								prop31: {
									prop32: {},
								},
							},
						}}
						action={ACTION.RE_RENDERED}
						actionSubject={ACTION_SUBJECT.EDITOR}
						handleAnalyticsEvent={mockHandleAnalyticsEvent}
						propsToIgnore={[]}
						useShallow={false}
					/>,
					container,
				);
			});
		}

		waitForDebounce();

		expect(mockHandleAnalyticsEvent).toHaveBeenCalledTimes(0);
	});

	it('should set render count to 1 on second render with propsDifference', async () => {
		if (process.env.IS_REACT_18 === 'true') {
			act(() => {
				root.render(
					<RenderTracking<ComponentProps>
						componentProps={{
							prop2: 10,
							prop3: {},
						}}
						action={ACTION.RE_RENDERED}
						actionSubject={ACTION_SUBJECT.REACT_EDITOR_VIEW}
						handleAnalyticsEvent={mockHandleAnalyticsEvent}
						propsToIgnore={[]}
						useShallow={false}
					/>,
				);
			});
		} else {
			act(() => {
				render(
					<RenderTracking<ComponentProps>
						componentProps={{
							prop2: 10,
							prop3: {},
						}}
						action={ACTION.RE_RENDERED}
						actionSubject={ACTION_SUBJECT.REACT_EDITOR_VIEW}
						handleAnalyticsEvent={mockHandleAnalyticsEvent}
						propsToIgnore={[]}
						useShallow={false}
					/>,
					container,
				);
			});
		}

		if (process.env.IS_REACT_18 === 'true') {
			act(() => {
				root.render(
					<RenderTracking<ComponentProps>
						componentProps={{
							prop1: 'abc',
							prop2: 11,
							prop3: {},
						}}
						action={ACTION.RE_RENDERED}
						actionSubject={ACTION_SUBJECT.REACT_EDITOR_VIEW}
						handleAnalyticsEvent={mockHandleAnalyticsEvent}
						propsToIgnore={[]}
						useShallow={false}
					/>,
				);
			});
		} else {
			act(() => {
				render(
					<RenderTracking<ComponentProps>
						componentProps={{
							prop1: 'abc',
							prop2: 11,
							prop3: {},
						}}
						action={ACTION.RE_RENDERED}
						actionSubject={ACTION_SUBJECT.REACT_EDITOR_VIEW}
						handleAnalyticsEvent={mockHandleAnalyticsEvent}
						propsToIgnore={[]}
						useShallow={false}
					/>,
					container,
				);
			});
		}

		waitForDebounce();

		const difference = {
			added: ['prop1'],
			changed: [
				{
					key: 'prop2',
					oldValue: 10,
					newValue: 11,
				},
				{
					key: 'prop3',
					difference: {
						added: [],
						removed: [],
						changed: [],
					},
				},
			],
			removed: [],
		};
		expect(mockHandleAnalyticsEvent).toHaveBeenCalledTimes(1);
		expect(mockHandleAnalyticsEvent).toHaveBeenLastCalledWith({
			payload: {
				action: ACTION.RE_RENDERED,
				actionSubject: ACTION_SUBJECT.REACT_EDITOR_VIEW,
				attributes: {
					propsDifference: difference,
					count: 1,
				},
				eventType: EVENT_TYPE.OPERATIONAL,
			},
		});
	});

	it('should do shallow props difference.', async () => {
		if (process.env.IS_REACT_18 === 'true') {
			act(() => {
				root.render(
					<RenderTracking<ComponentProps>
						componentProps={{
							prop2: 10,
							prop3: {
								prop31: {
									prop32: 10,
								},
							},
						}}
						action={ACTION.RE_RENDERED}
						actionSubject={ACTION_SUBJECT.REACT_EDITOR_VIEW}
						handleAnalyticsEvent={mockHandleAnalyticsEvent}
						propsToIgnore={[]}
						useShallow={false}
					/>,
				);
			});
		} else {
			act(() => {
				render(
					<RenderTracking<ComponentProps>
						componentProps={{
							prop2: 10,
							prop3: {
								prop31: {
									prop32: 10,
								},
							},
						}}
						action={ACTION.RE_RENDERED}
						actionSubject={ACTION_SUBJECT.REACT_EDITOR_VIEW}
						handleAnalyticsEvent={mockHandleAnalyticsEvent}
						propsToIgnore={[]}
						useShallow={false}
					/>,
					container,
				);
			});
		}

		if (process.env.IS_REACT_18 === 'true') {
			act(() => {
				root.render(
					<RenderTracking<ComponentProps>
						componentProps={{
							prop1: 'abc',
							prop2: 11,
							prop3: {
								prop31: {
									prop32: 11,
								},
							},
						}}
						action={ACTION.RE_RENDERED}
						actionSubject={ACTION_SUBJECT.REACT_EDITOR_VIEW}
						handleAnalyticsEvent={mockHandleAnalyticsEvent}
						propsToIgnore={[]}
						useShallow={true}
					/>,
				);
			});
		} else {
			act(() => {
				render(
					<RenderTracking<ComponentProps>
						componentProps={{
							prop1: 'abc',
							prop2: 11,
							prop3: {
								prop31: {
									prop32: 11,
								},
							},
						}}
						action={ACTION.RE_RENDERED}
						actionSubject={ACTION_SUBJECT.REACT_EDITOR_VIEW}
						handleAnalyticsEvent={mockHandleAnalyticsEvent}
						propsToIgnore={[]}
						useShallow={true}
					/>,
					container,
				);
			});
		}

		waitForDebounce();

		const difference = {
			added: ['prop1'],
			changed: ['prop2', 'prop3'],
			removed: [],
		};
		expect(mockHandleAnalyticsEvent).toHaveBeenCalledTimes(1);
		expect(mockHandleAnalyticsEvent).toHaveBeenLastCalledWith({
			payload: {
				action: ACTION.RE_RENDERED,
				actionSubject: ACTION_SUBJECT.REACT_EDITOR_VIEW,
				attributes: {
					propsDifference: difference,
					count: 1,
				},
				eventType: EVENT_TYPE.OPERATIONAL,
			},
		});
	});

	it('should only fire a single analytics event with total count', () => {
		if (process.env.IS_REACT_18 === 'true') {
			act(() => {
				root.render(
					<RenderTracking<ComponentProps>
						componentProps={{
							prop1: 'a',
						}}
						action={ACTION.RE_RENDERED}
						actionSubject={ACTION_SUBJECT.REACT_EDITOR_VIEW}
						handleAnalyticsEvent={mockHandleAnalyticsEvent}
						propsToIgnore={[]}
						useShallow={false}
					/>,
				);
			});
		} else {
			act(() => {
				render(
					<RenderTracking<ComponentProps>
						componentProps={{
							prop1: 'a',
						}}
						action={ACTION.RE_RENDERED}
						actionSubject={ACTION_SUBJECT.REACT_EDITOR_VIEW}
						handleAnalyticsEvent={mockHandleAnalyticsEvent}
						propsToIgnore={[]}
						useShallow={false}
					/>,
					container,
				);
			});
		}

		if (process.env.IS_REACT_18 === 'true') {
			act(() => {
				root.render(
					<RenderTracking<ComponentProps>
						componentProps={{
							prop1: 'a',
						}}
						action={ACTION.RE_RENDERED}
						actionSubject={ACTION_SUBJECT.REACT_EDITOR_VIEW}
						handleAnalyticsEvent={mockHandleAnalyticsEvent}
						propsToIgnore={[]}
						useShallow={false}
					/>,
				);
			});
		} else {
			act(() => {
				render(
					<RenderTracking<ComponentProps>
						componentProps={{
							prop1: 'a',
						}}
						action={ACTION.RE_RENDERED}
						actionSubject={ACTION_SUBJECT.REACT_EDITOR_VIEW}
						handleAnalyticsEvent={mockHandleAnalyticsEvent}
						propsToIgnore={[]}
						useShallow={false}
					/>,
					container,
				);
			});
		}

		if (process.env.IS_REACT_18 === 'true') {
			act(() => {
				root.render(
					<RenderTracking<ComponentProps>
						componentProps={{
							prop1: 'a',
						}}
						action={ACTION.RE_RENDERED}
						actionSubject={ACTION_SUBJECT.REACT_EDITOR_VIEW}
						handleAnalyticsEvent={mockHandleAnalyticsEvent}
						propsToIgnore={[]}
						useShallow={false}
					/>,
				);
			});
		} else {
			act(() => {
				render(
					<RenderTracking<ComponentProps>
						componentProps={{
							prop1: 'a',
						}}
						action={ACTION.RE_RENDERED}
						actionSubject={ACTION_SUBJECT.REACT_EDITOR_VIEW}
						handleAnalyticsEvent={mockHandleAnalyticsEvent}
						propsToIgnore={[]}
						useShallow={false}
					/>,
					container,
				);
			});
		}

		waitForDebounce();

		expect(mockHandleAnalyticsEvent).toHaveBeenCalledTimes(1);
		expect(mockHandleAnalyticsEvent).toHaveBeenCalledWith({
			payload: {
				action: ACTION.RE_RENDERED,
				actionSubject: ACTION_SUBJECT.REACT_EDITOR_VIEW,
				attributes: expect.objectContaining({
					count: 2,
				}),
				eventType: EVENT_TYPE.OPERATIONAL,
			},
		});
	});
});
