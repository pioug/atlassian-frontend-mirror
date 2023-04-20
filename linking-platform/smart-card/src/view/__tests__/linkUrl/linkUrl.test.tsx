import React, { ComponentProps } from 'react';

import '@atlaskit/link-test-helpers/jest';

import { render, screen, fireEvent } from '@testing-library/react';
import { AnalyticsListener } from '@atlaskit/analytics-next';

import { ANALYTICS_CHANNEL } from '../../../utils/analytics';
import LinkUrl from '../../LinkUrl';

describe('LinkUrl', () => {
  let LinkUrlTestId: string = 'link-with-safety';
  let mockLinkDestination: string = 'https://some.url';

  it.each<{
    mockLinkDescription: string;
    checkSafety: boolean;
    expected: boolean;
  }>([
    {
      mockLinkDescription: 'link description',
      expected: false,
      checkSafety: true,
    },
    {
      mockLinkDescription: 'https://another.url',
      expected: true,
      checkSafety: true,
    },
    {
      mockLinkDescription: mockLinkDestination,
      expected: false,
      checkSafety: true,
    },
    {
      mockLinkDescription: 'https://another.url',
      expected: false,
      checkSafety: false,
    },
  ])('correctly show safety warning message', (testData) => {
    const { mockLinkDescription, expected, checkSafety } = testData;

    const { getByTestId } = render(
      <LinkUrl href={mockLinkDestination} checkSafety={checkSafety}>
        {mockLinkDescription}
      </LinkUrl>,
    );
    const LinkUrlView = getByTestId(LinkUrlTestId);
    fireEvent.click(LinkUrlView);
    const isLinkUnsafe = !!screen.queryByText('Check this link');

    expect(isLinkUnsafe).toBe(expected);
  });

  it('should fire analytics event when link safety warning message is appeared', () => {
    const onEvent = jest.fn();

    const { getByTestId } = render(
      <AnalyticsListener channel={ANALYTICS_CHANNEL} onEvent={onEvent}>
        <LinkUrl href="https://some.url" checkSafety={true}>
          https://another.url
        </LinkUrl>
      </AnalyticsListener>,
    );

    const LinkUrlView = getByTestId(LinkUrlTestId);
    fireEvent.click(LinkUrlView);

    expect(onEvent).toBeCalledWith(
      expect.objectContaining({
        hasFired: true,
        payload: expect.objectContaining({
          action: 'shown',
          actionSubject: 'warningModal',
          actionSubjectId: 'linkSafetyWarning',
          eventType: 'operational',
        }),
        context: expect.arrayContaining([
          {
            componentName: 'linkUrl',
            packageName: '@atlaskit/smart-card',
            packageVersion: '999.9.9',
          },
        ]),
      }),
      ANALYTICS_CHANNEL,
    );
  });

  describe('link clicked', () => {
    const setup = (props?: ComponentProps<typeof LinkUrl>) => {
      const onEvent = jest.fn();

      const { getByTestId, getByRole } = render(
        <AnalyticsListener channel={ANALYTICS_CHANNEL} onEvent={onEvent}>
          <LinkUrl href="https://some.url" checkSafety={true} {...props}>
            https://another.url
          </LinkUrl>
        </AnalyticsListener>,
      );

      const component = getByRole('link');

      return {
        onEvent,
        getByTestId,
        component,
      };
    };

    it('should fire `link clicked` event when left clicked', () => {
      const { component, onEvent } = setup();

      fireEvent.click(component);

      expect(onEvent).toBeFiredWithAnalyticEventOnce({
        payload: {
          action: 'clicked',
          actionSubject: 'link',
          eventType: 'ui',
          attributes: {
            clickType: 'left',
            clickOutcome: 'clickThrough',
            defaultPrevented: true,
            keysHeld: [],
          },
        },
      });
    });

    it('should call `onClick` when clicked and still fire `link clicked` event', () => {
      const onClick = jest.fn();
      const { component, onEvent } = setup({ onClick });

      fireEvent.click(component);

      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onClick).toHaveBeenCalledWith(expect.anything());

      expect(onEvent).toBeFiredWithAnalyticEventOnce({
        payload: {
          action: 'clicked',
          actionSubject: 'link',
          eventType: 'ui',
          attributes: {
            clickType: 'left',
            clickOutcome: 'clickThrough',
            defaultPrevented: true,
            keysHeld: [],
          },
        },
      });
    });

    it('should fire `link clicked` event when right clicked', () => {
      const { component, onEvent } = setup();

      fireEvent.mouseDown(component, { button: 2 });

      expect(onEvent).toBeFiredWithAnalyticEventOnce({
        payload: {
          action: 'clicked',
          actionSubject: 'link',
          eventType: 'ui',
          attributes: {
            clickType: 'right',
            clickOutcome: 'contextMenu',
            keysHeld: [],
          },
        },
      });
    });

    it('should call `onMouseDown` if provided and still fire `link clicked` event', () => {
      const onMouseDown = jest.fn();
      const { component, onEvent } = setup({ onMouseDown });

      fireEvent.mouseDown(component, { button: 2 });

      expect(onMouseDown).toHaveBeenCalledTimes(1);
      expect(onMouseDown).toHaveBeenCalledWith(expect.anything());

      expect(onEvent).toBeFiredWithAnalyticEventOnce({
        payload: {
          action: 'clicked',
          actionSubject: 'link',
          eventType: 'ui',
          attributes: {
            clickType: 'right',
            clickOutcome: 'contextMenu',
            keysHeld: [],
          },
        },
      });
    });
  });
});
