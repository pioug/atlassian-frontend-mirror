import React from 'react';
import { mount } from 'enzyme';
import { SmartCardContext as Context } from '../..';
import CardClient from '../../../client';
import { SmartCardProvider } from '..';

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
          maxAge: 15000,
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
});
