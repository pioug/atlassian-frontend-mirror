import React from 'react';
import { render, screen } from '@testing-library/react';

import { url, cardState } from '@atlaskit/media-test-helpers/smart-card-state';
import '@atlaskit/link-test-helpers/jest';
import { AnalyticsListener } from '@atlaskit/analytics-next';

import { CardSSR, CardSSRProps } from '../../ssr';
import { Provider, Client } from '../../';
import * as CardWithUrlContent from '../../view/CardWithUrl/component';
import { ANALYTICS_CHANNEL, context } from '../../utils/analytics';

const cardMock = jest.spyOn(CardWithUrlContent, 'CardWithUrlContent');

describe('<SSRCard />', () => {
  const cardProps: CardSSRProps = {
    appearance: 'inline',
    url,
  };

  const setup = (props?: Partial<CardSSRProps>) => {
    const spy = jest.fn();
    const storeOptions: any = {
      initialState: {
        [url]: cardState,
      },
    };
    render(
      <AnalyticsListener channel={ANALYTICS_CHANNEL} onEvent={spy}>
        <Provider storeOptions={storeOptions} client={new Client('stg')}>
          <CardSSR {...cardProps} {...props} />
        </Provider>
        ,
      </AnalyticsListener>,
    );

    return {
      spy,
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render CardWithUrlContent with provided props', async () => {
    setup();
    const resolvedCard = await screen.findByTestId('inline-card-resolved-view');
    expect(resolvedCard).toBeVisible();
    expect(resolvedCard).toHaveAttribute('href', url);
  });

  it('should render error fallback component with correct props', async () => {
    cardMock.mockImplementationOnce(() => {
      throw new Error();
    });
    setup();
    const fallbackComponent = await screen.findByTestId(
      'lazy-render-placeholder',
    );
    expect(fallbackComponent).toBeVisible();
  });

  describe('props', () => {
    it('should pass down id prop if there is one', () => {
      const id = 'abc';

      setup({
        id,
      });

      expect(cardMock).toHaveBeenCalledWith(
        expect.objectContaining({ id }),
        expect.anything(),
      );
    });

    it('should provide random uuid for id prop if there is not one provided', () => {
      setup();

      expect(cardMock).toHaveBeenCalledWith(
        expect.objectContaining({ id: expect.any(String) }),
        expect.anything(),
      );
    });
  });

  describe('analytics', () => {
    it('should fire analytics events', async () => {
      const { spy } = setup();

      await screen.findByTestId('inline-card-resolved-view');

      expect(spy).toBeFiredWithAnalyticEventOnce({
        payload: {
          action: 'renderSuccess',
          actionSubject: 'smartLink',
        },
        context: [context],
      });
    });
  });
});
