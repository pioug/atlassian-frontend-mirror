import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';

import Blanket from '../../blanket';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

describe('Blanket', () => {
  const setup = (analyticsContext = {}) => {
    const onBlanketClicked = jest.fn();
    const onAnalyticsEvent = jest.fn();

    const renderResult = render(
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
      renderResult,
      onBlanketClicked,
      onAnalyticsEvent,
      blanketClickedEventResult,
    };
  };
  it('should send blanketClicked event to atlaskit/analytics when blanket is clicked', () => {
    const {
      renderResult,
      onBlanketClicked,
      onAnalyticsEvent,
      blanketClickedEventResult,
    } = setup();

    fireEvent.click(renderResult.getByTestId('blanket'));

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

  it('should allow the addition of additional context', () => {
    const analyticsContext = { key: 'value' };
    const { renderResult, onBlanketClicked, blanketClickedEventResult } = setup(
      analyticsContext,
    );

    fireEvent.click(renderResult.getByTestId('blanket'));

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
