import noop from 'lodash/noop';
import { type StoreActionApi } from 'react-sweet-state';

import { EventType } from '@atlaskit/jql-editor-common/constants';

import { Action, ActionSubject } from '../../analytics/constants';
import { initialState } from '../index';
import { type State } from '../types';

import { onStartAutocompleteEvent } from './index';

const storeActionApi: StoreActionApi<State> = {
	getState: () => initialState,
	setState: noop,
	dispatch: (thunk) => thunk(storeActionApi, undefined),
};
const createAndFireAnalyticsEvent = jest.fn();
const containerProps: any = { createAndFireAnalyticsEvent };

const flushPromises = () => Promise.resolve();

describe('onStartAutocompleteEvent', function () {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.useFakeTimers({ legacyFakeTimers: true });
		performance.mark = jest.fn();
		performance.measure = jest.fn();
		performance.clearMarks = jest.fn();
		performance.clearMeasures = jest.fn();
		performance.getEntriesByName = jest.fn(() => []);
	});

	it('fires an event when onStopAutocompleteEvent is called after the debounce period', async () => {
		const thunk = onStartAutocompleteEvent();
		const { onStopAutocompleteEvent } = thunk(storeActionApi, containerProps);

		onStopAutocompleteEvent(true, ['fields'], true);

		const attributes = {
			optionTypes: ['fields'],
			hasOptions: true,
		};

		await flushPromises();
		expect(createAndFireAnalyticsEvent).not.toHaveBeenCalled();

		// Fast-forward until all timers have been executed
		jest.runAllTimers();

		await flushPromises();
		expect(createAndFireAnalyticsEvent).toHaveBeenCalledWith({
			action: Action.RETRIEVED,
			actionSubject: ActionSubject.AUTOCOMPLETE_OPTION,
			eventType: EventType.OPERATIONAL,
			attributes,
		});
	});

	it('includes functionName when the caret is inside a function argument', async () => {
		const thunk = onStartAutocompleteEvent();
		const { onStopAutocompleteEvent } = thunk(storeActionApi, containerProps);

		onStopAutocompleteEvent(true, ['values'], true, 'descendantsofteam');

		// Fast-forward until all timers have been executed
		jest.runAllTimers();

		await flushPromises();
		expect(createAndFireAnalyticsEvent).toHaveBeenCalledWith({
			action: Action.RETRIEVED,
			actionSubject: ActionSubject.AUTOCOMPLETE_OPTION,
			eventType: EventType.OPERATIONAL,
			attributes: {
				optionTypes: ['values'],
				hasOptions: true,
				functionName: 'descendantsofteam',
			},
		});
	});

	it('includes functionName on the failure event when the caret is inside a function argument', async () => {
		const thunk = onStartAutocompleteEvent();
		const { onStopAutocompleteEvent } = thunk(storeActionApi, containerProps);

		onStopAutocompleteEvent(false, ['values'], false, 'descendantsofteam');

		// Fast-forward until all timers have been executed
		jest.runAllTimers();

		await flushPromises();
		expect(createAndFireAnalyticsEvent).toHaveBeenCalledWith({
			action: Action.RETRIEVE_FAILED,
			actionSubject: ActionSubject.AUTOCOMPLETE_OPTION,
			eventType: EventType.OPERATIONAL,
			attributes: {
				optionTypes: ['values'],
				hasOptions: false,
				functionName: 'descendantsofteam',
			},
		});
	});

	it.each([
		['a Forge/Connect registered function', 'myforgejqlfunction'],
		['a quoted function name carrying user text', '"a team name typed by the user"'],
	])('buckets %s as other', async (_, functionName) => {
		const thunk = onStartAutocompleteEvent();
		const { onStopAutocompleteEvent } = thunk(storeActionApi, containerProps);

		onStopAutocompleteEvent(true, ['values'], true, functionName);

		jest.runAllTimers();

		await flushPromises();
		expect(createAndFireAnalyticsEvent).toHaveBeenCalledWith(
			expect.objectContaining({
				attributes: expect.objectContaining({ functionName: 'other' }),
			}),
		);
	});

	it.each([
		['success', true, Action.RETRIEVED],
		['failure', false, Action.RETRIEVE_FAILED],
	])(
		'omits functionName from the %s event when no function name is provided',
		async (_, isSuccess, action) => {
			const thunk = onStartAutocompleteEvent();
			const { onStopAutocompleteEvent } = thunk(storeActionApi, containerProps);

			onStopAutocompleteEvent(isSuccess, ['fields'], true);

			// Fast-forward until all timers have been executed
			jest.runAllTimers();

			await flushPromises();
			expect(createAndFireAnalyticsEvent).toHaveBeenCalledWith(expect.objectContaining({ action }));
			expect(createAndFireAnalyticsEvent.mock.calls[0][0].attributes).not.toHaveProperty(
				'functionName',
			);
		},
	);

	// A blank name identifies no function, so it is omitted rather than bucketed to `other`, matching
	// how the `autocompleteOption selected` event treats it.
	it.each([
		['an empty name', ''],
		['a whitespace-only name', ' '],
	])('omits functionName when the caller passes %s', async (_, functionName) => {
		const thunk = onStartAutocompleteEvent();
		const { onStopAutocompleteEvent } = thunk(storeActionApi, containerProps);

		onStopAutocompleteEvent(true, ['fields'], true, functionName);

		jest.runAllTimers();

		await flushPromises();
		expect(createAndFireAnalyticsEvent).toHaveBeenCalledTimes(1);
		expect(createAndFireAnalyticsEvent.mock.calls[0][0].attributes).not.toHaveProperty(
			'functionName',
		);
	});

	it('does not fire an event when onStopAutocompleteEvent is called after the debounce period and the event has been unsubscribed', async () => {
		const thunk = onStartAutocompleteEvent();
		const { analyticsSubscription, onStopAutocompleteEvent } = thunk(
			storeActionApi,
			containerProps,
		);

		onStopAutocompleteEvent(true, ['fields'], true);

		await flushPromises();
		expect(createAndFireAnalyticsEvent).not.toHaveBeenCalled();

		// Unsubscribe from the analytics event
		analyticsSubscription.unsubscribe();

		// Fast-forward until all timers have been executed
		jest.runAllTimers();

		await flushPromises();
		expect(createAndFireAnalyticsEvent).not.toHaveBeenCalled();
	});
});
