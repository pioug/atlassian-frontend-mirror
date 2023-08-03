import React from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import Button from '@atlaskit/button/standard-button';
import {
  InlineCardResolvedView,
  InlineCardResolvingView,
  InlineCardErroredView,
  InlineCardForbiddenView,
  InlineCardUnauthorizedView,
} from '../src/view/InlineCard';
import {
  InlineCardResolvedView as RedesignedInlineCardResolvedView,
  InlineCardResolvingView as RedesignedInlineCardResolvingView,
  InlineCardErroredView as RedesignedInlineCardErroredView,
  InlineCardForbiddenView as RedesignedInlineCardForbiddenView,
  InlineCardUnauthorizedView as RedesignedInlineCardInlineCardForbiddenView,
} from '../src/view/RedesignedInlineCard';
import { IntlProvider } from 'react-intl-next';
import { mockAnalytics } from '../src/utils/mocks';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

const [
  ResolvedView,
  ResolvingView,
  ErroredView,
  ForbiddenView,
  UnauthorizedView,
] = getBooleanFF(
  'platform.linking-platform.smart-card.show-smart-links-refreshed-design',
)
  ? [
      RedesignedInlineCardResolvedView,
      RedesignedInlineCardResolvingView,
      RedesignedInlineCardErroredView,
      RedesignedInlineCardForbiddenView,
      RedesignedInlineCardInlineCardForbiddenView,
    ]
  : [
      InlineCardResolvedView,
      InlineCardResolvingView,
      InlineCardErroredView,
      InlineCardForbiddenView,
      InlineCardUnauthorizedView,
    ];

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
    const requestAccessContext = {
      callToActionMessageKey: 'click_to_join',
      action: {
        promise: () => new Promise((resolve) => resolve(alert('Joined!'))),
        id: 'click_to_join',
        text: 'Join to preview',
      },
    };
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
              <UnauthorizedView
                isSelected={this.state.isSelected}
                icon={icon}
                onClick={() => {}}
                onAuthorise={() => {
                  alert('Does nothing...');
                }}
                url={url}
                analytics={mockAnalytics}
              />
              <h4>ResolvingView</h4>
              Labore sunt adipisicing esse magna.
              <ResolvingView
                inlinePreloaderStyle="on-left-with-skeleton"
                isSelected={this.state.isSelected}
                url={url}
                onClick={onClick}
              />
              <h4>Forbidden View</h4>
              Labore sunt adipisicing esse magna.
              <ForbiddenView
                isSelected={this.state.isSelected}
                url={url}
                onClick={() => {
                  alert("Clicking me won't fix the permissions...");
                }}
                onAuthorise={() => {
                  alert('Okay, what else have we got...');
                }}
              />
              <h4>Forbidden View with request access context message</h4>
              Labore sunt adipisicing esse magna.
              <ForbiddenView
                isSelected={this.state.isSelected}
                url={url}
                requestAccessContext={requestAccessContext as any}
                context="Jira"
              />
              <h4>Errored View</h4>
              Labore sunt adipisicing esse magna.
              <ErroredView
                isSelected={this.state.isSelected}
                message="Ooops, something went wrong!"
                url={url}
                onClick={() => {}}
                onRetry={() => {
                  alert('Trying really hard!');
                }}
              />
              <h4>Resolved view</h4>
              Labore sunt adipisicing esse magna.
              <ResolvedView
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
