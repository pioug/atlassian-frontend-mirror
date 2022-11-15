import React from 'react';
import { mount } from 'enzyme';
import { ErrorBoundary } from 'react-error-boundary';
import { CardSSR, CardSSRProps } from '../../ssr';
import { Provider, Client } from '../../';
import { CardWithUrlContent } from '../../view/CardWithUrl/component';
import { url, cardState } from '@atlaskit/media-test-helpers/smart-card-state';
import { LoadingCardLink } from '../../view/CardWithUrl/component-lazy/LazyFallback';

describe('<SSRCard />', () => {
  const cardProps: CardSSRProps = {
    appearance: 'inline',
    url,
  };
  const setup = () => {
    const storeOptions: any = {
      initialState: {
        [url]: cardState,
      },
    };
    const card = mount(
      <Provider storeOptions={storeOptions} client={new Client('stg')}>
        <CardSSR {...cardProps} />
      </Provider>,
    );

    return {
      card,
    };
  };
  it('should render CardWithUrlContent with provided props', () => {
    const { card } = setup();

    expect(card.find(CardWithUrlContent).props()).toEqual(
      expect.objectContaining(cardProps),
    );
  });

  it('should render error fallback component with correct props', () => {
    const { card } = setup();

    const FallbackComponent = card
      .find(ErrorBoundary)
      .prop('FallbackComponent') as () => any;

    const fallbackComponent = FallbackComponent();
    expect(fallbackComponent.type).toBe(LoadingCardLink);
    expect(fallbackComponent.props).toEqual(expect.objectContaining(cardProps));
  });
});
