import React from 'react';

import {
  AnalyticsListener,
  useAnalyticsEvents,
} from '@atlaskit/analytics-next';
import { renderWithIntl as render } from '@atlaskit/link-test-helpers';

import { ANALYTICS_CHANNEL } from '../constants';

import { withLinkPickerAnalyticsContext } from './index';

describe('withLinkPickerAnalyticsContext', () => {
  const EVENT_PAYLOAD = {
    action: 'fired',
    actionSubject: 'event',
  };

  const TestComponent = ({ url }: { url?: string }) => {
    const { createAnalyticsEvent } = useAnalyticsEvents();
    const event = createAnalyticsEvent(EVENT_PAYLOAD);
    event.fire(ANALYTICS_CHANNEL);
    return <div data-testid="test-component">{url}</div>;
  };

  const ComposedComponent = withLinkPickerAnalyticsContext(TestComponent);

  const setup = (
    props: React.ComponentProps<typeof ComposedComponent> = {},
  ) => {
    const spy = jest.fn();

    render(
      <AnalyticsListener channel={ANALYTICS_CHANNEL} onEvent={spy}>
        <ComposedComponent {...props} />
      </AnalyticsListener>,
    );

    return { spy };
  };

  it('provides `linkState` attribute as `newLink` if there is no `url` props', () => {
    const { spy } = setup();

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: {
          ...EVENT_PAYLOAD,
          attributes: expect.objectContaining({ linkState: 'newLink' }),
        },
      }),
      ANALYTICS_CHANNEL,
    );
  });

  it('provides `linkState` attribute as `newLink` if provided a `url` prop value that is not a valid URL', () => {
    const { spy } = setup({ url: 'xyz' });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: {
          ...EVENT_PAYLOAD,
          attributes: expect.objectContaining({ linkState: 'newLink' }),
        },
      }),
      ANALYTICS_CHANNEL,
    );
  });

  it('provides `linkState` attribute as `editLink` if provided a valid url', () => {
    const { spy } = setup({ url: 'https://atlassian.com' });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: {
          ...EVENT_PAYLOAD,
          attributes: expect.objectContaining({ linkState: 'editLink' }),
        },
      }),
      ANALYTICS_CHANNEL,
    );
  });
});
