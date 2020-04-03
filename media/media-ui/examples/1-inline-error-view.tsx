import React from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { Label } from '@atlaskit/field-base';
import TextField from '@atlaskit/textfield';
import { InlineCardErroredView } from '../src/InlineCard/ErroredView';
import { IntlProvider } from 'react-intl';

class Example extends React.Component {
  state = {
    url: 'https://product-fabric.atlassian.net/browse/MSW-524',
  };

  handleUrlChange = (event: React.ChangeEvent<any>) => {
    this.setState({ url: event.target.value });
  };

  render() {
    return (
      <IntlProvider locale={'en'}>
        <Page>
          <Grid>
            <GridColumn>
              <Label htmlFor="url" label="URL" />
              <TextField
                autoFocus
                value={this.state.url}
                onChange={this.handleUrlChange}
              />
            </GridColumn>
          </Grid>
          <Grid>
            <GridColumn>
              <InlineCardErroredView
                url={this.state.url}
                message="Something went wrong here"
                onClick={() => alert('This will have zero effect...')}
                onRetry={() => alert('Trying hard...')}
              />
              <hr />
            </GridColumn>
          </Grid>
          <Grid>
            <GridColumn>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Praesent in finibus augue. Etiam ut leo justo. Proin consequat
                lacus id leo{' '}
                <InlineCardErroredView
                  url={this.state.url}
                  message="Something went wrong here"
                  onClick={() => alert('This will have zero effect...')}
                  onRetry={() => alert('Trying hard...')}
                />{' '}
                volutpat ornare sodales nec purus. Curabitur tempor lacinia
                auctor. Proin commodo quis nisi at rutrum. In hac habitasse
                platea dictumst. Nam feugiat neque eget est pharetra euismod.
                Praesent eu neque mattis, vulputate nunc et, condimentum est.
                Integer in neque sit amet magna facilisis facilisis.
              </p>
            </GridColumn>
          </Grid>
        </Page>
      </IntlProvider>
    );
  }
}

export default () => <Example />;
