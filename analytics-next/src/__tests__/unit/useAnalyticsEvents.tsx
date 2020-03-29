/* eslint-disable no-console */
import React, { useEffect } from 'react';
import { render } from '@testing-library/react';
import { useAnalyticsEvents } from '../../useAnalyticsEvents';
import AnalyticsListener from '../../AnalyticsListener';
import AnalyticsContext from '../../AnalyticsContext';

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

  it('should log an error when firing if there was no parent AnalyticsListener found', () => {
    const { rerender } = render(<Component />);
    (console.error as jest.Mock).mockReset();

    rerender(<Component fire />);

    expect(console.error).toHaveBeenCalledWith(`
@atlaskit/analytics-next
---
No compatible <AnalyticsListener /> was found to fire this analytics event.
Use of the useAnalyticsEvents() hook requires a parent <AnalyticsListener /> from @atlaskit/analytics-next@^6.3.0 or above.
See: https://atlaskit.atlassian.com/packages/core/analytics-next/docs/reference#AnalyticsListener
`);
  });

  it('should log every time when firing if there was no parent AnalyticsListener found', () => {
    const { rerender } = render(<Component />);
    (console.error as jest.Mock).mockReset();

    rerender(<Component fire />);
    rerender(<Component fire />);

    expect(console.error).toHaveBeenCalledTimes(2);
  });

  it('should not log anything if a parent AnalyticsListener exists', () => {
    render(
      <AnalyticsListener onEvent={() => {}}>
        <Component />
      </AnalyticsListener>,
    );

    expect(console.error).not.toHaveBeenCalled();
  });

  it('should not log anything in production builds', () => {
    process.env.NODE_ENV = 'production';

    render(<Component fire />);

    expect(console.error).not.toHaveBeenCalled();
  });
});
