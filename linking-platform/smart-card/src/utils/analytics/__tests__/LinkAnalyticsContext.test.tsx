import React, { useEffect } from 'react';

import {
  AnalyticsListener,
  useAnalyticsEvents,
} from '@atlaskit/analytics-next';
import { render } from '@testing-library/react';
import '@atlaskit/link-test-helpers/jest';

import { LinkAnalyticsContext } from '../LinkAnalyticsContext';

describe('LinkAnalyticsContext', () => {
  const payload = {
    action: 'fired',
    actionSubject: 'event',
  };

  const DummyComponent = () => {
    const { createAnalyticsEvent } = useAnalyticsEvents();

    useEffect(() => {
      createAnalyticsEvent(payload).fire('media');
    }, [createAnalyticsEvent]);

    return null;
  };

  it('should add analytics context to events based on url', () => {
    const source = 'fooScreen';
    const display = 'url';
    const id = 'fooId';
    const spy = jest.fn();

    render(
      <AnalyticsListener onEvent={spy} channel="*">
        <LinkAnalyticsContext display={display} source={source} id={id}>
          <DummyComponent />
        </LinkAnalyticsContext>
      </AnalyticsListener>,
    );

    expect(spy).toBeFiredWithAnalyticEventOnce({
      payload,
      context: [
        {
          source,
          attributes: {
            displayCategory: 'link',
            display,
            id,
          },
        },
      ],
    });
  });

  it('should not set displayCategory attribute if display is not url', () => {
    const display = 'inline';
    const spy = jest.fn();

    render(
      <AnalyticsListener onEvent={spy} channel="*">
        <LinkAnalyticsContext display={display}>
          <DummyComponent />
        </LinkAnalyticsContext>
      </AnalyticsListener>,
    );

    expect(spy).toBeFiredWithAnalyticEventOnce({
      payload,
      context: [
        {
          attributes: {
            displayCategory: undefined,
            display,
          },
        },
      ],
    });
  });
});
