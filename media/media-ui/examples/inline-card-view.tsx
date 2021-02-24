import React from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import Button from '@atlaskit/button/standard-button';
import {
  InlineCardResolvedView,
  InlineCardResolvingView,
  InlineCardErroredView,
  InlineCardForbiddenView,
  InlineCardUnauthorizedView,
} from '../src/InlineCard';
import { IntlProvider } from 'react-intl';

interface Lozenge {
  text: string;
  appearance: 'inprogress';
}

const url = 'https://product-fabric.atlassian.net/browse/MSW-524';
const icon =
  'https://product-fabric.atlassian.net/images/icons/issuetypes/story.svg';
const title = 'MSW-524: [RFC] Api for inline Link cards UI component';
const lozenge: Lozenge = {
  text: 'in progress',
  appearance: 'inprogress',
};
const onClick = () => window.open(url);

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
            </GridColumn>
          </Grid>
          <Grid>
            <GridColumn>
              <h4>Unauthorised view</h4>
              Labore sunt adipisicing esse magna.
              <InlineCardUnauthorizedView
                isSelected={this.state.isSelected}
                icon={icon}
                onClick={() => {}}
                onAuthorise={() => {
                  alert('Does nothing...');
                }}
                url={url}
              />
              <h4>ResolvingView</h4>
              Labore sunt adipisicing esse magna.
              <InlineCardResolvingView
                inlinePreloaderStyle="on-left-with-skeleton"
                isSelected={this.state.isSelected}
                url={url}
                onClick={onClick}
              />
              Labore sunt adipisicing esse magna.
              <h4>No Permissions View</h4>
              Labore sunt adipisicing esse magna.
              <InlineCardForbiddenView
                isSelected={this.state.isSelected}
                url={url}
                onClick={() => {
                  alert("Clicking me won't fix the permissions...");
                }}
                onAuthorise={() => {
                  alert('Okay, what else have we got...');
                }}
              />
              <h4>Errored View</h4>
              Labore sunt adipisicing esse magna.
              <InlineCardErroredView
                isSelected={this.state.isSelected}
                message="Ooops, something went wrong!"
                url={url}
                onClick={() => {}}
                onRetry={() => {
                  alert('Trying really hard!');
                }}
              />
              Labore sunt adipisicing esse magna.
              <h4>Resolved view</h4>
              Labore sunt adipisicing esse magna.
              <InlineCardResolvedView
                isSelected={this.state.isSelected}
                icon={icon}
                title={title}
                lozenge={lozenge}
                onClick={onClick}
              />
            </GridColumn>
          </Grid>
        </Page>
      </IntlProvider>
    );
  }
}

export default () => <Example />;
