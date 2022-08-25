import React from 'react';

import { renderWithIntl as render } from '@atlaskit/link-test-helpers';
import { fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import { AnalyticsListener } from '@atlaskit/analytics-next';

import { LinkPickerProps } from '../../../';
import { ANALYTICS_CHANNEL } from '../../../common/constants';
import LinkPicker, { testIds } from '../../link-picker';
import matches from 'lodash/matches';

expect.extend({
  toBeFiredWithAnalyticEventOnce(analyticsListenerSpy, event, channel) {
    const matchingEvents = analyticsListenerSpy.mock.calls.filter(
      (arg: any[]) => matches(event)(arg[0]),
    );

    if (matchingEvents.length === 1) {
      if (channel && matchingEvents[0][1] !== channel) {
        return {
          message: () =>
            `expected analytic event to have been fired once on channel '${channel}', it actually fired on channel '${matchingEvents[0][1]}'`,
          pass: false,
        };
      }

      return {
        message: () => `analytic event was fired once`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected analytic event to have been fired once`,
        pass: false,
      };
    }
  },
});

describe('LinkPicker analytics', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const setupLinkPicker = ({
    url = '',
    plugins,
    ...props
  }: Partial<LinkPickerProps> = {}) => {
    const spy = jest.fn();

    const wrappedLinkPicker = render(
      <AnalyticsListener channel={ANALYTICS_CHANNEL} onEvent={spy}>
        <LinkPicker
          url={url}
          onSubmit={jest.fn()}
          plugins={plugins ?? []}
          onCancel={jest.fn()}
          onContentResize={jest.fn()}
          {...props}
        />
      </AnalyticsListener>,
    );

    return {
      spy,
      testIds,
      wrappedLinkPicker,
    };
  };

  it('should fire `ui.form.submitted.linkPicker` on form submission', async () => {
    const { spy, testIds } = setupLinkPicker();

    await userEvent.type(
      screen.getByTestId(testIds.urlInputField),
      'www.atlassian.com',
    );

    fireEvent.submit(screen.getByTestId(testIds.urlInputField));

    expect(spy).toBeFiredWithAnalyticEventOnce(
      {
        hasFired: true,
        context: [
          {
            attributes: {
              linkState: 'newLink',
            },
          },
        ],
        payload: {
          action: 'submitted',
          eventType: 'ui',
          actionSubject: 'form',
          actionSubjectId: 'linkPicker',
          attributes: {},
        },
      },
      ANALYTICS_CHANNEL,
    );
  });

  it('should fire `ui.inlineDialog.viewed.linkPicker` once on picker mounting', async () => {
    const { spy } = setupLinkPicker();

    expect(spy).toBeFiredWithAnalyticEventOnce(
      {
        hasFired: true,
        context: [
          {
            attributes: {
              linkState: 'newLink',
            },
          },
        ],
        payload: {
          action: 'viewed',
          eventType: 'ui',
          actionSubject: 'inlineDialog',
          actionSubjectId: 'linkPicker',
          attributes: {},
        },
      },
      ANALYTICS_CHANNEL,
    );
  });

  it('should fire `ui.inlineDialog.closed.linkPicker` once on picker unmounting', async () => {
    const { spy, wrappedLinkPicker } = setupLinkPicker();

    wrappedLinkPicker.unmount();

    expect(spy).toBeFiredWithAnalyticEventOnce(
      {
        hasFired: true,
        context: [
          {
            attributes: {
              linkState: 'newLink',
            },
          },
        ],
        payload: {
          action: 'closed',
          eventType: 'ui',
          actionSubject: 'inlineDialog',
          actionSubjectId: 'linkPicker',
          attributes: {},
        },
      },
      ANALYTICS_CHANNEL,
    );
  });

  describe('LinkPickerAnalyticsContext', () => {
    it('`linkState` attribute should be `newLink` when URL prop is NOT provided', async () => {
      const { spy, testIds } = setupLinkPicker();

      await userEvent.type(
        screen.getByTestId(testIds.urlInputField),
        'www.atlassian.com',
      );

      fireEvent.submit(screen.getByTestId(testIds.urlInputField));

      expect(spy).toBeFiredWithAnalyticEventOnce(
        {
          hasFired: true,
          context: [
            {
              attributes: {
                linkState: 'newLink',
              },
            },
          ],
          payload: {
            action: 'submitted',
            eventType: 'ui',
            actionSubject: 'form',
            actionSubjectId: 'linkPicker',
            attributes: {},
          },
        },
        ANALYTICS_CHANNEL,
      );
    });

    it('`linkState` attribute should be `editLink` when URL prop IS provided', async () => {
      const { spy, testIds } = setupLinkPicker({
        url: 'https://atlassian.com',
      });

      fireEvent.submit(screen.getByTestId(testIds.urlInputField));

      expect(spy).toBeFiredWithAnalyticEventOnce(
        {
          hasFired: true,
          context: [
            {
              attributes: {
                linkState: 'editLink',
              },
            },
          ],
          payload: {
            action: 'submitted',
            eventType: 'ui',
            actionSubject: 'form',
            actionSubjectId: 'linkPicker',
            attributes: {},
          },
        },
        ANALYTICS_CHANNEL,
      );
    });
  });
});
