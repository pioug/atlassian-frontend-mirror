jest.mock('../../../extractors/common/preview/extractPreview', () => ({
  extractPreview: () => 'some-link-preview',
}));

import React from 'react';
import { mount } from 'enzyme';
import { SmartCardContext as Context } from '../..';
import CardClient from '../../../client';
import { SmartCardProvider, CardContext } from '..';
import { CardStore } from '../../store/types';

describe('Provider', () => {
  it('should setup provider with default options', () => {
    const render = jest.fn();
    const client = new CardClient();
    mount(
      <SmartCardProvider client={client}>
        <Context.Consumer>{render}</Context.Consumer>
      </SmartCardProvider>,
    );
    expect(render).toBeCalledWith(
      expect.objectContaining({
        config: {
          maxAge: 60000,
          maxLoadingDelay: 1200,
          authFlow: 'oauth2',
        },
        connections: {
          client,
        },
      }),
    );
  });

  it('should setup provider with custom options', () => {
    const render = jest.fn();
    const client = new CardClient();
    mount(
      <SmartCardProvider
        client={client}
        cacheOptions={{ maxAge: 100, maxLoadingDelay: 100 }}
      >
        <Context.Consumer>{render}</Context.Consumer>
      </SmartCardProvider>,
    );
    expect(render).toBeCalledWith(
      expect.objectContaining({
        config: {
          maxAge: 100,
          maxLoadingDelay: 100,
          authFlow: 'oauth2',
        },
        connections: {
          client,
        },
      }),
    );
  });

  it('should reuse top-level provider when nested with other providers', () => {
    const render = jest.fn();
    const client = new CardClient();
    mount(
      <SmartCardProvider
        client={client}
        cacheOptions={{ maxAge: 100, maxLoadingDelay: 100 }}
      >
        <SmartCardProvider client={client}>
          <Context.Consumer>{render}</Context.Consumer>
        </SmartCardProvider>
      </SmartCardProvider>,
    );
    expect(render).toBeCalledWith(
      expect.objectContaining({
        config: {
          maxAge: 100,
          maxLoadingDelay: 100,
          authFlow: 'oauth2',
        },
        connections: {
          client,
        },
      }),
    );
  });

  it('should expose extractors to consumers', () => {
    const render = (context?: CardContext) => {
      const linkPreview = context && context.extractors.getPreview('some-url');
      expect(linkPreview).toEqual('some-link-preview');
      return <div></div>;
    };

    const client = new CardClient();
    const initialState: CardStore = {
      'some-url': {
        status: 'resolved',
        details: {} as any,
        lastUpdatedAt: 1,
      },
    };

    mount(
      <SmartCardProvider client={client} storeOptions={{ initialState }}>
        <Context.Consumer>{render}</Context.Consumer>
      </SmartCardProvider>,
    );
  });
});
