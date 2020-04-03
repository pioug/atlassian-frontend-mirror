import React from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { Label } from '@atlaskit/field-base';
import TextField from '@atlaskit/textfield';
import { IntlProvider } from 'react-intl';
import { InlineCardUnauthorizedView } from '../src/InlineCard/UnauthorisedView';

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
              <InlineCardUnauthorizedView
                url={this.state.url}
                onClick={() => alert('This will have zero effect...')}
              />
              <hr />
            </GridColumn>
          </Grid>
          <Grid>
            <GridColumn>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Praesent in finibus augue. Etiam ut leo justo. Proin consequat
                lacus id leo <InlineCardUnauthorizedView url={this.state.url} />{' '}
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
