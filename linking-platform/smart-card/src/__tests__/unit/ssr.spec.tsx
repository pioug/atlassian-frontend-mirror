import React from 'react';
import { render, screen } from '@testing-library/react';
import { CardSSR, CardSSRProps } from '../../ssr';
import { Provider, Client } from '../../';
import * as CardWithUrlContent from '../../view/CardWithUrl/component';
import { url, cardState } from '@atlaskit/media-test-helpers/smart-card-state';

const cardMock = jest.spyOn(CardWithUrlContent, 'CardWithUrlContent');

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
    render(
      <Provider storeOptions={storeOptions} client={new Client('stg')}>
        <CardSSR {...cardProps} />
      </Provider>,
    );
  };
  it('should render CardWithUrlContent with provided props', async () => {
    setup();
    const resolvedCard = await screen.findByTestId('inline-card-resolved-view');
    expect(resolvedCard).toBeVisible();
    expect(resolvedCard).toHaveAttribute('href', url);
  });

  it('should render error fallback component with correct props', async () => {
    cardMock.mockImplementation(() => {
      throw new Error();
    });
    setup();
    const fallbackComponent = await screen.findByTestId(
      'lazy-render-placeholder',
    );
    expect(fallbackComponent).toBeVisible();
  });
});
