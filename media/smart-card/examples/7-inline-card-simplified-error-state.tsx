import React from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { Card, Client, Provider, ResolveResponse } from '../src';

class ForbiddenClient extends Client {
  fetchData(): Promise<ResolveResponse> {
    return Promise.resolve({
      meta: {
        access: 'forbidden',
        visibility: 'restricted',
        definitionId: 'd1',
        auth: [],
      },
      data: undefined,
    } as ResolveResponse);
  }
}

class ForbiddenClientWithAuth extends Client {
  fetchData(): Promise<ResolveResponse> {
    return Promise.resolve({
      meta: {
        access: 'forbidden',
        visibility: 'restricted',
        definitionId: 'd1',
        auth: [
          {
            key: 'mock-key',
            displayName: 'mock-name',
            url: 'http://mock-url',
          },
        ],
      },
      data: undefined,
    } as ResolveResponse);
  }
}

class UnAuthCustomClient extends Client {
  fetchData(): Promise<ResolveResponse> {
    return Promise.resolve({
      meta: {
        access: 'unauthorized',
        visibility: 'restricted',
        definitionId: 'd1',
        auth: [],
      },
      data: undefined,
    } as ResolveResponse);
  }
}

class UnAuthCustomClientWithAction extends Client {
  fetchData(): Promise<ResolveResponse> {
    return Promise.resolve({
      meta: {
        access: 'unauthorized',
        visibility: 'restricted',
        definitionId: 'd1',
        auth: [
          {
            key: 'mock-key',
            displayName: 'mock-name',
            url: 'http://mock-url',
          },
        ],
      },
      data: undefined,
    } as ResolveResponse);
  }
}

class ErroringCustomClient extends Client {
  fetchData(url: string): Promise<ResolveResponse> {
    return Promise.reject(`Can't resolve from ${url}`);
  }
}

class NotFoundClient extends Client {
  constructor() {
    super();

    // @ts-ignore we're overriding a private API here for example purposes.
    this.getLoader = (_hostname: string) => {
      return {
        load: async () => ({
          status: 404,
          body: {},
        }),
      };
    };
  }
}

const unAuthClient = new UnAuthCustomClient();
const unAuthClientWithAction = new UnAuthCustomClientWithAction();
const erroringClient = new ErroringCustomClient();
const notFoundClient = new NotFoundClient();
const forbiddenClient = new ForbiddenClient();

class Example extends React.Component {
  render() {
    return (
      <Page>
        <Grid>
          <GridColumn>
            <h4>Unauthorized response</h4>
            <Provider client={unAuthClient}>
              <Card url="http://some.unauth.url" appearance="inline" />
            </Provider>

            <hr />

            <h4>Unauthorized response with auth</h4>
            <Provider client={unAuthClientWithAction}>
              <Card url="http://some.unauth.url" appearance="inline" />
            </Provider>

            <hr />

            <h4>Forbidden response</h4>
            <Provider client={forbiddenClient}>
              <Card url="http://some.unauth.url" appearance="inline" />
            </Provider>

            <hr />

            <h4>Forbidden response with auth</h4>
            <Provider client={new ForbiddenClientWithAuth()}>
              <Card url="http://some.unauth.url" appearance="inline" />
            </Provider>

            <hr />
            <h4>Error response</h4>
            <Provider client={erroringClient}>
              <Card url="http://some.error.url" appearance="inline" />
            </Provider>

            <hr />

            <h4>Not found response</h4>
            <Provider client={(notFoundClient as any) as Client}>
              <Card url="http://some.notfound.url" appearance="inline" />
            </Provider>
          </GridColumn>
        </Grid>
      </Page>
    );
  }
}

export default () => <Example />;
