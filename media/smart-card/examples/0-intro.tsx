import React from 'react';
import { IntlProvider } from 'react-intl';

import Page, { Grid, GridColumn } from '@atlaskit/page';
import Form, { Field, FormHeader } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import Button from '@atlaskit/button/standard-button';
import { Provider, Card } from '../src';
import { CardAppearance } from '../src/view/Card/types';
import { Checkbox } from '@atlaskit/checkbox';
import { RadioGroup } from '@atlaskit/radio';
import urlsJSON from '../examples-helpers/example-urls.json';
import SmartCardClient from '../src/client';

const params =
  typeof URLSearchParams !== 'undefined'
    ? new URLSearchParams(location.search.slice(1))
    : null;
const param = params ? params.get('url') : null;
const defaultURL = param
  ? param
  : 'https://docs.google.com/document/d/1igbED2X5Qt8rQCeO-5rbDGG6u51wUNumlo2P_EtC9lo/edit';

export interface ExampleState {
  appearance: CardAppearance;
  url: string;
  isSelected: boolean;
}

class Example extends React.Component<{}, ExampleState> {
  state: ExampleState = {
    appearance: 'block',
    url: defaultURL,
    isSelected: false,
  };

  preventDefaultAndSetUrl(url: string) {
    return (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      this.setState({ url });
    };
  }

  handleUrlChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({ url: (event.target as HTMLInputElement).value });
  };

  changeUrl = (url: string) => {
    this.setState({ url });
  };

  handleIsSelected = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      isSelected: (event.target as HTMLInputElement).checked,
    });
  };

  handleAppearanceChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      appearance: (event.target as HTMLInputElement).value as any,
    });
  };

  renderCard(url: string, isSelected: boolean, appearance: CardAppearance) {
    if (url) {
      return <Card isSelected={isSelected} appearance={appearance} url={url} />;
    }
    return null;
  }

  render() {
    const { appearance, url, isSelected } = this.state;

    return (
      <IntlProvider locale="en">
        <Provider client={new SmartCardClient('staging')}>
          <Page>
            <Grid>
              <GridColumn medium={12} key={url}>
                <div
                  style={{
                    margin: '20px 0',
                    minHeight: 150,
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {this.renderCard(url, isSelected, appearance)}
                </div>
              </GridColumn>
              <GridColumn medium={6}>
                <Form onSubmit={() => {}}>
                  {() => (
                    <form>
                      <FormHeader title="Card options" />
                      <Field name="url" label="Url">
                        {() => (
                          <Textfield
                            onChange={this.handleUrlChange}
                            value={url}
                            autoFocus
                          />
                        )}
                      </Field>
                      <Field name="appearance" label="Appearance">
                        {() => (
                          <RadioGroup
                            options={[
                              { label: 'Block', value: 'block' },
                              { label: 'Inline', value: 'inline' },
                            ]}
                            value={appearance}
                            onChange={this.handleAppearanceChange}
                          />
                        )}
                      </Field>
                      <Field name="selected" label="Selection">
                        {() => (
                          <Checkbox
                            isChecked={isSelected}
                            onChange={this.handleIsSelected}
                            label="is selected"
                            value="isSelected"
                            name="isSelected"
                          />
                        )}
                      </Field>
                    </form>
                  )}
                </Form>
              </GridColumn>
              <GridColumn medium={6}>
                <h2>Example urls</h2>
                {urlsJSON.map((example: any, i: number) => (
                  <p key={i}>
                    <Button
                      spacing="compact"
                      onClick={() => this.changeUrl(example.url)}
                    >
                      Try it
                    </Button>
                    &nbsp;
                    <a href={example.url}>
                      {example.description ||
                        `${example.provider} ${example.visibility} ${example.type}`}
                    </a>
                  </p>
                ))}
              </GridColumn>
            </Grid>
          </Page>
        </Provider>
      </IntlProvider>
    );
  }
}

export default () => <Example />;
