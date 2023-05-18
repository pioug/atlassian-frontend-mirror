/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React from 'react';
import { IntlProvider } from 'react-intl-next';

import Page, { Grid, GridColumn } from '@atlaskit/page';
import Form, { Field, FormHeader } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import { CardClient as SmartCardClient } from '@atlaskit/link-provider';
import { Provider } from '../src';
import { Checkbox } from '@atlaskit/checkbox';
import { ufologger } from '@atlaskit/ufo';
import { token } from '@atlaskit/tokens';
import { HoverCard } from '../src/hoverCard';
import { CodeBlock } from '@atlaskit/code';
import { toComponentProps } from './utils/common';

ufologger.enable();

const params =
  typeof URLSearchParams !== 'undefined'
    ? new URLSearchParams(location.search.slice(1))
    : null;
const param = params ? params.get('url') : null;
const defaultURL = param
  ? param
  : 'https://jdog.jira-dev.com/browse/BENTO-4222';

const codeStyles = css`
  display: inline-grid;
  tab-size: 2;
`;

export interface ExampleState {
  url: string;
  hidePreviewButton: boolean;
  closeOnChildClick: boolean;
  canOpen: boolean;
  id: string;
}

class Example extends React.Component<{}, ExampleState> {
  state: ExampleState = {
    url: defaultURL,
    hidePreviewButton: false,
    closeOnChildClick: false,
    canOpen: true,
    id: 'NULL',
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

  handleIdChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({ id: (event.target as HTMLInputElement).value });
  };

  handleHidePreviewButtonChange = (
    event: React.FormEvent<HTMLInputElement>,
  ) => {
    this.setState({
      hidePreviewButton: (event.target as HTMLInputElement).checked,
    });
  };

  handleCloseOnChildClickChange = (
    event: React.FormEvent<HTMLInputElement>,
  ) => {
    this.setState({
      closeOnChildClick: (event.target as HTMLInputElement).checked,
    });
  };

  handleCanOpen = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      canOpen: (event.target as HTMLInputElement).checked,
    });
  };

  getCode = () => {
    return `<HoverCard ${toComponentProps(
      this.state,
    )}\n>\n\t\t{yourComponent}\n</HoverCard>`;
  };

  renderHoverCard(
    url: string,
    hidePreviewButton: boolean,
    closeOnChildClick: boolean,
    canOpen: boolean,
    id: string,
  ) {
    if (url) {
      return (
        <HoverCard
          url={url}
          hidePreviewButton={hidePreviewButton}
          closeOnChildClick={closeOnChildClick}
          canOpen={canOpen}
          id={id}
        >
          <h1
            style={{
              paddingTop: '10px',
              cursor: 'pointer',
              display: 'inline-block',
            }}
          >
            Hover over me!
          </h1>
        </HoverCard>
      );
    }
    return null;
  }

  render() {
    const { url, hidePreviewButton, closeOnChildClick, canOpen, id } =
      this.state;

    return (
      <IntlProvider locale="en">
        <Provider client={new SmartCardClient('staging')}>
          <Page>
            <Grid>
              <GridColumn medium={12} key={url}>
                <div
                  style={{
                    margin: '20px 0',
                    minHeight: 180,
                    borderBottom: `1px solid ${token('color.border', '#eee')}`,
                    textAlign: 'center',
                  }}
                >
                  {this.renderHoverCard(
                    url,
                    hidePreviewButton,
                    closeOnChildClick,
                    canOpen,
                    id,
                  )}
                </div>
              </GridColumn>
              <GridColumn medium={6}>
                <Form onSubmit={() => {}}>
                  {() => (
                    <form>
                      <FormHeader title="Hover Card options" />
                      <Field name="url" label="Url">
                        {() => (
                          <Textfield
                            onChange={this.handleUrlChange}
                            value={url}
                            autoFocus
                          />
                        )}
                      </Field>
                      <Field name="id" label="Id used for analytics">
                        {() => (
                          <Textfield
                            onChange={this.handleIdChange}
                            value={id}
                            autoFocus
                          />
                        )}
                      </Field>
                      <Checkbox
                        isChecked={hidePreviewButton}
                        onChange={this.handleHidePreviewButtonChange}
                        label="Hide Preview Button"
                        value="hidePreviewButton"
                        name="hidePreviewButton"
                      />
                      <Checkbox
                        isChecked={closeOnChildClick}
                        onChange={this.handleCloseOnChildClickChange}
                        label="Close Child on Click"
                        value="closeChildOnClick"
                        name="closeChildOnClick"
                      />
                      <Checkbox
                        isChecked={canOpen}
                        onChange={this.handleCanOpen}
                        label="Can Open"
                        value="canOpen"
                        name="canOpen"
                      />
                    </form>
                  )}
                </Form>
              </GridColumn>
              <GridColumn medium={6}>
                <div css={codeStyles}>
                  <CodeBlock language="jsx" text={this.getCode()} />
                </div>
              </GridColumn>
            </Grid>
          </Page>
        </Provider>
      </IntlProvider>
    );
  }
}

export default () => <Example />;
