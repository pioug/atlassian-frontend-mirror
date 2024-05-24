import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';

import Blanket from '../../blanket';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

describe('Blanket', () => {
  const setup = (analyticsContext = {}) => {
    const onBlanketClicked = jest.fn();
    const onAnalyticsEvent = jest.fn();

    render(
      <AnalyticsListener channel="atlaskit" onEvent={onAnalyticsEvent}>
        <Blanket
          testId="blanket"
          onBlanketClicked={onBlanketClicked}
          analyticsContext={analyticsContext}
        />
      </AnalyticsListener>,
    );

    const blanketClickedEventResult = {
      payload: {
        action: 'clicked',
        actionSubject: 'blanket',
        attributes: {
          componentName: 'blanket',
          packageName,
          packageVersion,
        },
      },
    };

    return {
      onBlanketClicked,
      onAnalyticsEvent,
      blanketClickedEventResult,
    };
  };
  it('should send blanketClicked event to atlaskit/analytics when blanket is clicked', async () => {
    const { onBlanketClicked, onAnalyticsEvent, blanketClickedEventResult } =
      setup();

    await userEvent.click(screen.getByTestId('blanket'));

    expect(onBlanketClicked).toHaveBeenCalledTimes(1);

    expect(onAnalyticsEvent).toHaveBeenCalledTimes(1);

    expect(onAnalyticsEvent).toHaveBeenCalledWith(
      expect.objectContaining(blanketClickedEventResult),
      'atlaskit',
    );
  });
  it('should not error if there is no analytics provider', () => {
    const error = jest.spyOn(console, 'error');

    render(<Blanket />);

    expect(error).not.toHaveBeenCalled();

    error.mockRestore();
  });

  it('should allow the addition of additional context', async () => {
    const analyticsContext = { key: 'value' };
    const { onBlanketClicked, blanketClickedEventResult } =
      setup(analyticsContext);

    await userEvent.click(screen.getByTestId('blanket'));

    const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
      ...blanketClickedEventResult,
      context: [
        {
          componentName: 'blanket',
          packageName,
          packageVersion,
          ...analyticsContext,
        },
      ],
    });

    expect(onBlanketClicked).toHaveBeenCalledTimes(1);
    expect(onBlanketClicked.mock.calls[0][1].payload).toEqual(expected.payload);
    expect(onBlanketClicked.mock.calls[0][1].context).toEqual(expected.context);
  });
});
