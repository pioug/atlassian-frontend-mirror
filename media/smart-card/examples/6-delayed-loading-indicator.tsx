import React from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import Form, { Field, FormHeader } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import { Card, Client, Provider, ResolveResponse } from '../src';

const customResponse = (url: string): ResolveResponse => ({
  meta: {
    access: 'granted',
    visibility: 'public',
    definitionId: 'd1',
    auth: [],
  },
  data: {
    '@type': 'Object',
    '@context': {
      '@vocab': 'https://www.w3.org/ns/activitystreams#',
      atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
      schema: 'http://schema.org/',
    },
    name: `Doc from ${url}`,
  },
});

const customDataFetch = (n: number, url: string): Promise<ResolveResponse> =>
  new Promise((res) => setTimeout(res, n, customResponse(url)));

class CustomClient extends Client {
  constructor(private responseDelay: number) {
    super('staging');
  }
  fetchData(url: string): Promise<ResolveResponse> {
    return customDataFetch(this.responseDelay, url);
  }
}

type ExampleState = {
  client: CustomClient;
  responseDelay: number;
  loadingStateDelay: number;
  url: string;
};

class Example extends React.Component<any, ExampleState> {
  state = {
    responseDelay: 4000,
    loadingStateDelay: 2000,
    client: new CustomClient(4000),
    url: 'https://some.url',
  };
  setResponseDelay = (e: React.SyntheticEvent) => {
    const val = (e.target as any).value;
    this.setState({
      responseDelay: val,
      client: new CustomClient(val),
    });
  };
  setLoadingStateDelay = (e: React.SyntheticEvent) => {
    const val = (e.target as any).value;
    this.setState({
      loadingStateDelay: val,
      client: new CustomClient(this.state.responseDelay),
    });
  };
  setUrl = (e: React.SyntheticEvent) => {
    const val = (e.target as any).value;
    this.setState({
      url: val,
    });
  };
  render() {
    return (
      <Page>
        <Grid>
          <GridColumn medium={8}>
            <div style={{ margin: '20px 0', minHeight: 150 }}>
              <Provider client={this.state.client} key={this.state.url}>
                <Card url={this.state.url} appearance="block" />
                <br />
                <Card url={this.state.url} appearance="inline" />
              </Provider>
            </div>
          </GridColumn>
          <GridColumn medium={4}>
            <Form onSubmit={() => {}}>
              {() => (
                <form>
                  <FormHeader title="Card options" />
                  <Field name="response-delay" label="Response delay">
                    {() => (
                      <Textfield
                        autoFocus
                        value={String(this.state.responseDelay)}
                        onChange={this.setResponseDelay}
                      />
                    )}
                  </Field>
                  <Field name="state-delay" label="Loading state delay">
                    {() => (
                      <Textfield
                        value={String(this.state.loadingStateDelay)}
                        onChange={this.setLoadingStateDelay}
                      />
                    )}
                  </Field>
                  <Field name="url" label="Url to display">
                    {() => (
                      <Textfield
                        value={this.state.url}
                        onChange={this.setUrl}
                      />
                    )}
                  </Field>
                </form>
              )}
            </Form>
          </GridColumn>
        </Grid>
      </Page>
    );
  }
}

export default () => <Example />;
