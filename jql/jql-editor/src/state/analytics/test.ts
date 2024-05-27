import noop from 'lodash/noop';
import { type StoreActionApi } from 'react-sweet-state';

import { Action, ActionSubject, EventType } from '../../analytics';
import { initialState } from '../index';
import { type State } from '../types';

import { onStartAutocompleteEvent } from './index';

const storeActionApi: StoreActionApi<State> = {
  getState: () => initialState,
  setState: noop,
  dispatch: thunk => thunk(storeActionApi, undefined),
};
const createAndFireAnalyticsEvent = jest.fn();
const containerProps: any = { createAndFireAnalyticsEvent };

const flushPromises = () => Promise.resolve();

describe('onStartAutocompleteEvent', function () {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers('legacy');
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
