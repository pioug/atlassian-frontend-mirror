import React from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import Button from '@atlaskit/button';
import {
  BlockCardResolvingView,
  BlockCardErroredView,
  BlockCardUnauthorisedView,
  BlockCardForbiddenView,
  BlockCardResolvedView,
} from '../src/BlockCard';
import { IntlProvider } from 'react-intl';

const url = 'https://www.dropbox.com/';
const icon =
  'https://aem.dropbox.com/cms/content/dam/dropbox/www/en-us/branding/app-dropbox-windows@2x.png';

const log = (name: string) => () => console.log(name);

class Example extends React.Component {
  state = {
    isSelected: false,
  };

  handleSelectedClick = () => {
    this.setState({
      isSelected: !this.state.isSelected,
    });
  };

  render() {
    return (
      <IntlProvider locale={'en'}>
        <Page>
          <Grid>
            <GridColumn>
              <Button
                aria-label="Is selected?"
                onClick={this.handleSelectedClick}
              >
                {this.state.isSelected ? 'Deselect' : 'Make those selected'}
              </Button>
              <h4>Loading</h4>
              <BlockCardResolvingView isSelected={this.state.isSelected} />

              <h4>Errored</h4>
              <BlockCardErroredView
                isSelected={this.state.isSelected}
                onRetry={log('Retry')}
              />

              <h4>Unauthorised</h4>
              <BlockCardUnauthorisedView
                isSelected={this.state.isSelected}
                actions={[]}
              />

              <h4>Forbidden</h4>
              <BlockCardForbiddenView
                isSelected={this.state.isSelected}
                byline={{ text: 'single thing' }}
              />

              <h4>Resolved</h4>
              <BlockCardResolvedView
                context={{
                  text: 'Dropbox',
                  icon: icon,
                }}
                link={url}
                title="foo bar"
                byline={{ text: 'foo bar' }}
                isSelected={this.state.isSelected}
                icon={{ url: icon }}
              />
              <br />
              <br />
              <BlockCardResolvedView
                isSelected={this.state.isSelected}
                context={{
                  text: 'Dropbox',
                  icon: icon,
                }}
                link={url}
                icon={{ url: icon }}
                title="The public is more familiar with bad design than good design. It is, in effect, conditioned to prefer bad design, because that is what it lives with. The ne"
                byline={{
                  text:
                    'Entity byline (not description) is limited to a single line, yep just one',
                }}
                description="Descriptions can be added in the meta data area using the text display. They are used to show additional information on the object and can be up to three lines"
                thumbnail="https://www.cupcakediariesblog.com/wp-content/uploads/2016/02/cookie-monster-cupcakes-2.jpg"
                details={[
                  {
                    iconUrl: icon,
                    text: '44.5MB',
                  },
                  {
                    iconUrl: icon,
                    text: '44.5MB',
                  },
                  {
                    iconUrl: icon,
                    text: '44.5MB',
                  },
                  {
                    iconUrl: icon,
                    text: '44.5MB',
                  },
                ]}
                users={[
                  {
                    name: 'James',
                    src:
                      'https://www.timelinecoverbanner.com/facebook-covers/2012/11/sunrise-earth.jpg',
                  },
                  { name: 'Scotty' },
                  { name: 'Artur' },
                  { name: 'Adam' },
                  { name: 'Sherif' },
                  { name: 'Waldemar' },
                ]}
                actions={[
                  {
                    id: 'success',
                    text: 'Success',
                    promise: () => Promise.resolve('Success!'),
                  },
                  {
                    id: 'failure',
                    text: 'Failure',
                    promise: () => Promise.reject(),
                  },
                  {
                    id: 'pending',
                    text: 'Pending',
                    promise: () =>
                      new Promise(resolve => {
                        // eslint-disable-next-line @wordpress/react-no-unsafe-timeout
                        setTimeout(() => {
                          resolve();
                        }, 5000);
                      }),
                  },
                ]}
              />
            </GridColumn>
          </Grid>
        </Page>
      </IntlProvider>
    );
  }
}

export default () => <Example />;
