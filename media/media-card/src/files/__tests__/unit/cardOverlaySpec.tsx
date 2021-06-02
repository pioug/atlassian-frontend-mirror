import React from 'react';
import { shallow, ShallowWrapper, ReactWrapper } from 'enzyme';
import { Ellipsify } from '@atlaskit/media-ui';
import { mountWithIntlContext } from '@atlaskit/media-test-helpers';
import { CardOverlay } from '../../cardImageView/cardOverlay';
import {
  TitleWrapper,
  Metadata,
  ErrorMessage,
} from '../../cardImageView/cardOverlay/styled';
import { CardActionsView } from '../../../utils/';

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
          cardStatus="error"
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
      expect(errorMessages.map((x) => x.text())).toEqual([
        errorMessage,
        altTextMessage,
      ]);
    });
  });

  describe('when the card is uploading', () => {
    const altTextMessage = 'alt text';

    it('should render the title if selected', () => {
      card = mountWithIntlContext(
        <CardOverlay
          cardStatus="uploading"
          mediaName={'card is lyfe'}
          subtitle={'do you even card?'}
          alt={altTextMessage}
          persistent={true}
          selected={true}
        />,
      );
      expect(card.find(TitleWrapper).find(Ellipsify)).toHaveLength(1);
      expect(card.find(TitleWrapper).find(Ellipsify).props().text).toEqual(
        'card is lyfe',
      );
    });

    it('should not render the title if not selected', () => {
      card = mountWithIntlContext(
        <CardOverlay
          cardStatus="uploading"
          mediaName={'card is lyfe'}
          subtitle={'do you even card?'}
          alt={altTextMessage}
          persistent={true}
          selected={false}
        />,
      );
      expect(card.find(TitleWrapper).find(Ellipsify)).toHaveLength(0);
    });
  });

  it('should pass triggerColor "white" to Menu component when overlay is NOT persistent', () => {
    card = shallow(<CardOverlay cardStatus="complete" persistent={false} />);
    expect(card.find(CardActionsView).props().triggerColor).toEqual('white');
  });

  it('should pass triggerColor as "undefined" to Menu component when overlay is persistent', () => {
    card = shallow(<CardOverlay cardStatus="complete" persistent={true} />);
    expect(card.find(CardActionsView).props().triggerColor).toEqual(undefined);
  });
});
