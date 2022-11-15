import React from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { Provider, Card, Client, ResolveResponse } from '../src';
import urlsJSON from '../examples-helpers/example-urls.json';
import { AsanaTask } from '../examples-helpers/_jsonLDExamples';
import '../examples-helpers';

class CustomClient extends Client {
  fetchData(url: string) {
    return Promise.resolve({
      meta: {
        visibility: 'public',
        access: 'granted',
        auth: [],
        definitionId: 'def1',
      },
      data: AsanaTask,
    } as ResolveResponse);
  }
}

const clientWithResolver = new CustomClient('staging');

function urlWithCard(url: string) {
  return (
    <>
      <p>
        This URL: <a>{url}</a> maps to this card:
      </p>
      <br />
      <Card url={url} appearance="block" />
    </>
  );
}

export default () => (
  <Page>
    <Provider client={new Client('staging')}>
      <Grid>
        <GridColumn>
          <h2>
            These card <em>DO NOT</em> use an custom resolver.
          </h2>
          {urlWithCard(urlsJSON[0].url)}
          <br />
          {urlWithCard(urlsJSON[1].url)}
          <br />
        </GridColumn>
      </Grid>
    </Provider>
    <br />
    <br />
    <Provider client={clientWithResolver}>
      <Grid>
        <GridColumn>
          <h2>
            These cards <em>DO</em> use an additional resolver.
          </h2>
          <p>
            Notice how the same URLs resolve to different things, since we've
            intercepted the requests using a custom resolver.
          </p>
          {urlWithCard(urlsJSON[0].url)}
          <br />
          {urlWithCard(urlsJSON[1].url)}
          <br />
        </GridColumn>
      </Grid>
    </Provider>
  </Page>
);
