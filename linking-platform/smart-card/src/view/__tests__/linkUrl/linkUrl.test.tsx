import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LinkUrl from '../../LinkUrl';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { ANALYTICS_CHANNEL } from '../../../utils/analytics';

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
});
