/* eslint-disable no-console */
import React, { useEffect } from 'react';

import { render } from '@testing-library/react';

import AnalyticsContext from '../../../components/AnalyticsContext';
import AnalyticsListener from '../../../components/AnalyticsListener';
import { useAnalyticsEvents } from '../../../hooks/useAnalyticsEvents';

const Component = (props: {
  passback?: (value: ReturnType<typeof useAnalyticsEvents>) => void;
  fire?: boolean;
}) => {
  const analytics = useAnalyticsEvents();
  props.passback && props.passback(analytics);
  useEffect(() => {
    if (props.fire) {
      analytics.createAnalyticsEvent({ name: 'component' }).fire();
    }
  });
  return null;
};

describe('useAnalyticsEvents()', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    (console.error as jest.Mock).mockReset();
  });

  it('should have a stable function reference between re-renders', () => {
    const passback = jest.fn();
    const { rerender } = render(<Component passback={passback} />);

    rerender(<Component passback={passback} />);

    expect(passback.mock.calls[0][0].createAnalyticsEvent).toBe(
      passback.mock.calls[1][0].createAnalyticsEvent,
    );
  });

  it('should have a stable function reference when being rerendered under an AnalyticsListener', () => {
    const passback = jest.fn();
    const { rerender } = render(
      <AnalyticsListener onEvent={() => {}}>
        <Component passback={passback} />
      </AnalyticsListener>,
    );

    rerender(
      <AnalyticsListener onEvent={() => {}}>
        <Component passback={passback} />
      </AnalyticsListener>,
    );

    expect(passback.mock.calls[0][0].createAnalyticsEvent).toBe(
      passback.mock.calls[1][0].createAnalyticsEvent,
    );
  });

  it('should have a stable function reference when being rerendered under an AnalyticsContext', () => {
    const passback = jest.fn();
    const { rerender } = render(
      <AnalyticsListener onEvent={() => {}}>
        <AnalyticsContext data={{}}>
          <Component passback={passback} />
        </AnalyticsContext>
      </AnalyticsListener>,
    );

    rerender(
      <AnalyticsListener onEvent={() => {}}>
        <AnalyticsContext data={{}}>
          <Component passback={passback} />
        </AnalyticsContext>
      </AnalyticsListener>,
    );

    expect(passback.mock.calls[0][0].createAnalyticsEvent).toBe(
      passback.mock.calls[1][0].createAnalyticsEvent,
    );
  });

  it('should fire an analytic event', () => {
    const callback = jest.fn();

    render(
      <AnalyticsListener onEvent={callback}>
        <AnalyticsContext data={{ fromContext: true }}>
          <Component fire />
        </AnalyticsContext>
      </AnalyticsListener>,
    );

    expect(callback.mock.calls[0][0].context).toEqual([
      {
        fromContext: true,
      },
    ]);
    expect(callback.mock.calls[0][0].payload).toEqual({
      name: 'component',
    });
  });
});
