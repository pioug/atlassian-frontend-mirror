import React from 'react';
import { shallow } from 'enzyme';
import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  RetryButton,
  NewExpRetryButton,
} from '../../cardImageView/cardOverlay/retryButton';
import { mountWithIntlContext } from '@atlaskit/media-test-helpers';
import { FormattedMessage } from 'react-intl';
import { FabricChannel } from '@atlaskit/analytics-listeners';

describe('RetryButton', () => {
  it('should render properly', () => {
    const onClick = jest.fn();
    const button = shallow(<RetryButton onClick={onClick} />);
    expect(button.find(FormattedMessage)).toHaveLength(1);
    button.simulate('click', {
      stopPropagation: () => {},
      preventDefault: () => {},
    });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should fire analytics event on click', () => {
    const analyticsEventHandler = jest.fn();
    const component = mountWithIntlContext(
      <AnalyticsListener
        channel={FabricChannel.media}
        onEvent={analyticsEventHandler}
      >
        <RetryButton onClick={() => {}} />,
      </AnalyticsListener>,
    );
    const retryButton = component.find(RetryButton);
    expect(retryButton).toHaveLength(1);
    retryButton.simulate('click');
    expect(analyticsEventHandler).toBeCalledTimes(1);
    const actualFiredEvent: UIAnalyticsEvent =
      analyticsEventHandler.mock.calls[0][0];
    expect(actualFiredEvent.payload).toMatchObject({
      eventType: 'ui',
      action: 'clicked',
      actionSubject: 'button',
      actionSubjectId: 'mediaCardRetry',
    });
  });
});

describe('NewExpRetryButton', () => {
  it('should render properly', () => {
    const onClick = jest.fn();
    const button = shallow(<NewExpRetryButton onClick={onClick} />);
    expect(button.find(FormattedMessage)).toHaveLength(1);
    button.simulate('click', {
      stopPropagation: () => {},
      preventDefault: () => {},
    });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should fire analytics event on click', () => {
    const analyticsEventHandler = jest.fn();
    const component = mountWithIntlContext(
      <AnalyticsListener
        channel={FabricChannel.media}
        onEvent={analyticsEventHandler}
      >
        <NewExpRetryButton onClick={() => {}} />,
      </AnalyticsListener>,
    );
    const retryButton = component.find(NewExpRetryButton);
    expect(retryButton).toHaveLength(1);
    retryButton.simulate('click');
    expect(analyticsEventHandler).toBeCalledTimes(1);
    const actualFiredEvent: UIAnalyticsEvent =
      analyticsEventHandler.mock.calls[0][0];
    expect(actualFiredEvent.payload).toMatchObject({
      eventType: 'ui',
      action: 'clicked',
      actionSubject: 'button',
      actionSubjectId: 'mediaCardRetry',
    });
  });
});
