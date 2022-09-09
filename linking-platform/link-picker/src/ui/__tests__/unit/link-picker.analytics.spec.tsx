import React from 'react';

import { renderWithIntl as render } from '@atlaskit/link-test-helpers';
import { fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import matches from 'lodash/matches';

import { LinkPicker, LinkPickerProps } from '../../../';
import { ANALYTICS_CHANNEL } from '../../../common/constants';
import { testIds } from '../../link-picker';
import { PACKAGE_DATA as ROOT_CONTEXT } from '../../';

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
    const onSubmit = jest.fn();

    const wrappedLinkPicker = render(
      <AnalyticsListener channel={ANALYTICS_CHANNEL} onEvent={spy}>
        <LinkPicker
          url={url}
          onSubmit={onSubmit}
          plugins={plugins ?? []}
          onCancel={jest.fn()}
          onContentResize={jest.fn()}
          {...props}
        />
      </AnalyticsListener>,
    );

    return {
      spy,
      onSubmit,
      testIds,
      wrappedLinkPicker,
    };
  };

  it('should fire `ui.form.submitted.linkPicker` and emit a clone of the `ui.form.submitted.linkPicker` event on form submission', async () => {
    const { onSubmit, spy, testIds } = setupLinkPicker();

    await userEvent.type(
      await screen.findByTestId(testIds.urlInputField),
      'www.atlassian.com',
    );

    fireEvent.submit(await screen.findByTestId(testIds.urlInputField));

    const payload = {
      action: 'submitted',
      eventType: 'ui',
      actionSubject: 'form',
      actionSubjectId: 'linkPicker',
      attributes: {},
    };

    const context = [
      ROOT_CONTEXT,
      {
        attributes: {
          linkState: 'newLink',
        },
      },
    ];

    expect(spy).toBeFiredWithAnalyticEventOnce(
      {
        hasFired: true,
        context,
        payload,
      },
      ANALYTICS_CHANNEL,
    );

    // Second onSubmit argument should be a `UIAnalyticsEvent` match the event dispatched
    // except it should not yet have been fired (`hasFired` = false)
    expect(onSubmit).toHaveBeenCalledWith<[{}, UIAnalyticsEvent]>(
      expect.objectContaining({
        url: 'http://www.atlassian.com',
      }),
      expect.any(UIAnalyticsEvent),
    );
    expect(onSubmit.mock.calls[0][1]).toStrictEqual(
      expect.objectContaining({
        hasFired: false,
        context,
        payload,
      }),
    );
  });

  it('should fire `ui.inlineDialog.viewed.linkPicker` once on picker mounting', async () => {
    const { spy } = setupLinkPicker();

    expect(spy).toBeFiredWithAnalyticEventOnce(
      {
        hasFired: true,
        context: [
          ROOT_CONTEXT,
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
          ROOT_CONTEXT,
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
            ROOT_CONTEXT,
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
            ROOT_CONTEXT,
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
