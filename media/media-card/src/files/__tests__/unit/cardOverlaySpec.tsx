import React from 'react';
import { shallow, ShallowWrapper, ReactWrapper } from 'enzyme';
import { Ellipsify } from '@atlaskit/media-ui';
import { mountWithIntlContext } from '@atlaskit/media-test-helpers';
import { CardOverlay } from '../../cardImageView/cardOverlay';
import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  TitleWrapper,
  Metadata,
  ErrorMessage,
  Retry,
} from '../../cardImageView/cardOverlay/styled';

import { CardActionsView } from '../../../utils/';
import { FabricChannel } from '@atlaskit/analytics-listeners';

describe('CardOverlay', () => {
  const errorMessage = 'Loading failed';
  let card: ReactWrapper | ShallowWrapper;

  afterEach(() => {
    if (card) {
      card.unmount();
    }
  });

  describe('when the card has errored', () => {
    const altTextMessage = 'alt text';
    beforeEach(() => {
      card = mountWithIntlContext(
        <CardOverlay
          error={errorMessage}
          mediaName={'card is lyfe'}
          subtitle={'do you even card?'}
          alt={altTextMessage}
          persistent={true}
        />,
      );
    });

    it('should not render the title or subtitle', () => {
      expect(card.find(TitleWrapper).find(Ellipsify)).toHaveLength(0);
      expect(card.find(Metadata)).toHaveLength(0);
    });

    it('should render both error message and alt text', () => {
      const errorMessages = card.find(ErrorMessage).children() as ReactWrapper;
      expect(errorMessages.map(x => x.text())).toEqual([
        errorMessage,
        altTextMessage,
      ]);
    });
  });

  it('should pass triggerColor "white" to Menu component when overlay is NOT persistent', () => {
    card = shallow(<CardOverlay persistent={false} />);
    expect(card.find(CardActionsView).props().triggerColor).toEqual('white');
  });

  it('should pass triggerColor as "undefined" to Menu component when overlay is persistent', () => {
    card = shallow(<CardOverlay persistent={true} />);
    expect(card.find(CardActionsView).props().triggerColor).toEqual(undefined);
  });

  it('should allow manual retry when "onRetry" is passed', () => {
    const onRetry = jest.fn();
    card = mountWithIntlContext(
      <CardOverlay persistent={false} onRetry={onRetry} error={errorMessage} />,
    );
    const retryComponent = card.find(Retry);

    expect(retryComponent).toHaveLength(1);
    retryComponent.simulate('click');
    expect(onRetry).toHaveBeenCalled();
  });

  it('should fire analytics event on Retry click', () => {
    const analyticsEventHandler = jest.fn();
    card = mountWithIntlContext(
      <AnalyticsListener
        channel={FabricChannel.media}
        onEvent={analyticsEventHandler}
      >
        <CardOverlay
          persistent={false}
          onRetry={() => {}}
          error={errorMessage}
        />
        ,
      </AnalyticsListener>,
    );
    const retryComponent = card.find(Retry);
    expect(retryComponent).toHaveLength(1);
    retryComponent.simulate('click');
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
