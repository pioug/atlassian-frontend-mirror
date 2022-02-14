import React from 'react';
import { mount } from 'enzyme';
import { CardSSR, CardSSRProps } from '../../ssr';
import { Provider, Client } from '../../';
import { CardWithUrlContent } from '../../view/CardWithUrl/component';
import { url, cardState } from '@atlaskit/media-test-helpers/smart-card-state';

describe('<SSRCard />', () => {
  it('should render CardWithUrlContent with provided props', () => {
    const cardProps: CardSSRProps = {
      appearance: 'inline',
      url,
    };
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

    expect(card.find(CardWithUrlContent).props()).toEqual(
      expect.objectContaining(cardProps),
    );
  });
});
