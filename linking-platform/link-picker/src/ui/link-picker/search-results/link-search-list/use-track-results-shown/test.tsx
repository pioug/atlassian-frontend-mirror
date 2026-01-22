import React from 'react';

import { act, renderHook } from '@testing-library/react';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';

import mockedPluginData from '../../../../../__tests__/__helpers/mock-plugin-data';
import { ANALYTICS_CHANNEL } from '../../../../../common/constants';

import { useTrackResultsShown } from './index';

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

interface HookProps {
	isLoading: Parameters<typeof useTrackResultsShown>[0];
	items: Parameters<typeof useTrackResultsShown>[1];
	hasSearchTerm: Parameters<typeof useTrackResultsShown>[2];
}

describe('useTrackResultsShown', () => {
	beforeAll(() => {
		jest.useFakeTimers();
	});

	afterAll(() => {
		jest.useRealTimers();
	});

	const setup = () => {
		const onEvent = jest.fn();

		const renderResult = renderHook<unknown, HookProps>(
			(props: HookProps) => useTrackResultsShown(props.isLoading, props.items, props.hasSearchTerm),
			{
				initialProps: { isLoading: false, items: null, hasSearchTerm: false },
				wrapper: ({ children }) => (
					<AnalyticsListener channel={ANALYTICS_CHANNEL} onEvent={onEvent}>
						{children}
					</AnalyticsListener>
				),
			},
		);

		return { onEvent, ...renderResult };
	};

	it('should NOT fire an event if there are no items', () => {
		const { onEvent } = setup();

		expect(onEvent).not.toHaveBeenCalled();
	});

	it('should NOT fire an event if isLoading', async () => {
		const { onEvent, rerender } = setup();

		expect(onEvent).not.toHaveBeenCalled();

		rerender({ isLoading: true, items: null, hasSearchTerm: true });

		expect(onEvent).not.toHaveBeenCalled();
	});

	it('should NOT fire an event if items changes but still isLoading', async () => {
		const { onEvent, rerender } = setup();

		expect(onEvent).not.toHaveBeenCalled();

		rerender({ isLoading: true, items: [], hasSearchTerm: true });

		expect(onEvent).not.toHaveBeenCalled();
	});

	it('should fire a pre-query event if NOT isLoading and items changes and there is no search term', async () => {
		const { onEvent, rerender } = setup();

		expect(onEvent).not.toHaveBeenCalled();

		rerender({ isLoading: false, items: [], hasSearchTerm: false });

		act(() => {
			jest.runAllTimers();
		});

		expect(onEvent).toHaveBeenCalledTimes(1);
		expect(onEvent).toBeCalledWith(
			expect.objectContaining({
				hasFired: true,
				payload: expect.objectContaining({
					action: 'shown',
					actionSubject: 'searchResults',
					actionSubjectId: 'preQuerySearchResults',
					attributes: expect.objectContaining({
						resultCount: 0,
					}),
					eventType: 'ui',
				}),
			}),
			ANALYTICS_CHANNEL,
		);
	});

	it('should fire a post-query event if NOT isLoading and items changes and there IS a search term', async () => {
		const { onEvent, rerender } = setup();

		expect(onEvent).not.toHaveBeenCalled();

		rerender({ isLoading: false, items: [], hasSearchTerm: true });

		act(() => {
			jest.runAllTimers();
		});

		expect(onEvent).toHaveBeenCalledTimes(1);
		expect(onEvent).toBeCalledWith(
			expect.objectContaining({
				hasFired: true,
				payload: expect.objectContaining({
					action: 'shown',
					actionSubject: 'searchResults',
					actionSubjectId: 'postQuerySearchResults',
					attributes: expect.objectContaining({
						resultCount: 0,
					}),
					eventType: 'ui',
				}),
			}),
			ANALYTICS_CHANNEL,
		);
	});

	it('should fire event with correct `resultCount` value', async () => {
		const { onEvent, rerender } = setup();

		expect(onEvent).not.toHaveBeenCalled();

		const items = mockedPluginData.slice(0, 3);

		rerender({ isLoading: false, items, hasSearchTerm: true });

		act(() => {
			jest.runAllTimers();
		});

		expect(onEvent).toHaveBeenCalledTimes(1);
		expect(onEvent).toBeCalledWith(
			expect.objectContaining({
				payload: expect.objectContaining({
					attributes: expect.objectContaining({
						resultCount: items.length,
					}),
				}),
			}),
			ANALYTICS_CHANNEL,
		);
	});

	it('should debounce the state and only fire an event once it is stable', async () => {
		const { onEvent, rerender } = setup();

		expect(onEvent).not.toHaveBeenCalled();

		const items = mockedPluginData.slice(0, 3);

		rerender({ isLoading: true, items, hasSearchTerm: true });
		rerender({ isLoading: false, items, hasSearchTerm: true });
		rerender({ isLoading: true, items: null, hasSearchTerm: false });
		rerender({ isLoading: true, items, hasSearchTerm: false });

		act(() => {
			jest.advanceTimersByTime(200);
		});

		expect(onEvent).toHaveBeenCalledTimes(0);

		rerender({ isLoading: true, items: null, hasSearchTerm: true });
		rerender({ isLoading: true, items, hasSearchTerm: true });
		rerender({ isLoading: false, items, hasSearchTerm: true });

		expect(onEvent).toHaveBeenCalledTimes(0);

		act(() => {
			jest.advanceTimersByTime(200);
		});

		expect(onEvent).toHaveBeenCalledTimes(0);

		act(() => {
			jest.advanceTimersByTime(200);
		});

		expect(onEvent).toHaveBeenCalledTimes(1);
		expect(onEvent).toBeCalledWith(
			expect.objectContaining({
				payload: expect.objectContaining({
					attributes: expect.objectContaining({
						resultCount: items.length,
					}),
				}),
			}),
			ANALYTICS_CHANNEL,
		);
	});
});
