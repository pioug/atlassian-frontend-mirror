import React from 'react';
import { mockEndpoints } from '@atlaskit/atlassian-switcher-test-utils';
import { withAnalyticsLogger, withIntlProvider } from './helpers';
import AtlassianSwitcher from '../src';
import { createJoinableSitesProvider } from '../src/cross-join/providers/default-joinable-sites-provider';
import { JoinableSitesResponse } from '../src/types';
import mockJoinableSites from '../test-helpers/mockJoinableSites';
import { FakeTrelloChrome } from './helpers/FakeTrelloChrome';

const fetchJoinableSites: () => Promise<JoinableSitesResponse> = () =>
  new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({ sites: mockJoinableSites.sites } as JoinableSitesResponse),
      1000,
    );
  });

const customJoinableSitesDataProvider = createJoinableSitesProvider(
  fetchJoinableSites,
);

class TrelloSwitcherJoinSectionHighlight extends React.Component {
  state = {
    highlightedJoinableItem: '',
  };

  componentDidMount() {
    mockEndpoints('veliko', (originalMockData) => originalMockData, {
      containers: 1000,
      xflow: 500,
      permitted: 2000,
      appswitcher: 1500,
    });

    setTimeout(() => {
      this.setState({
        highlightedJoinableItem:
          'https://atl-jsoler-20190708v3.jira-dev.com/product-landing-page',
      });
    }, 3000);
  }

  onClose = () => {};

  render() {
    return (
      <FakeTrelloChrome>
        <AtlassianSwitcher
          product="trello"
          appearance="standalone"
          cloudId="some-cloud-id"
          joinableSitesDataProvider={customJoinableSitesDataProvider}
          highlightedJoinableItemHref={this.state.highlightedJoinableItem}
          onClose={this.onClose}
        />
      </FakeTrelloChrome>
    );
  }
}

export default withIntlProvider(
  withAnalyticsLogger(TrelloSwitcherJoinSectionHighlight),
);
