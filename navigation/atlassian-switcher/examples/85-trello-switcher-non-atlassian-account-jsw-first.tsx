import React from 'react';
import {
  DataTransformer,
  mockAvailableProductsEndpoint,
  mockEndpoints,
} from '@atlaskit/atlassian-switcher-test-utils';
import Button from '@atlaskit/button/standard-button';
import { withAnalyticsLogger, withIntlProvider } from './helpers';
import { AvailableProductsResponse, AvailableSite } from '../src/types';
import AtlassianSwitcher from '../src';
import { Environment } from '../src/common/utils/environment';
import { getAvailableProductsUrl } from '../src/common/providers/trello/products-provider';
import { FakeTrelloChrome } from './helpers/FakeTrelloChrome';

const mockEndpointsDataTransformer: DataTransformer = originalMockData => {
  const availableProducts = originalMockData.AVAILABLE_PRODUCTS_DATA as AvailableProductsResponse;
  return {
    ...originalMockData,
    AVAILABLE_PRODUCTS_DATA: {
      sites: [
        availableProducts.sites
          .map((site: AvailableSite) => {
            // Get rid of all available products
            site.availableProducts = [];
            return site;
          })
          .filter((site: AvailableSite) => site.availableProducts.length),
      ],
    },
  };
};

class InlineDialogSwitcherExample extends React.Component {
  state = {
    isLoaded: false,
    isOpen: true,
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    mockAvailableProductsEndpoint(getAvailableProductsUrl(Environment.Staging));
    mockEndpoints('trello', mockEndpointsDataTransformer);
    this.setState({
      isLoaded: true,
    });
  };

  onTriggerXFlow() {
    console.log('triggerXFlow');
  }

  onDiscoverMoreClicked() {
    console.log('discoverMoreClicked');
  }

  onClose = () => {
    this.setState({
      isOpen: false,
    });
  };

  openSwitcher = () => {
    this.setState({
      isOpen: true,
    });
  };

  render() {
    // colors picked from trello's website. Alpha channel was removed to avoid overlays
    const trelloTheme = {
      primaryTextColor: '#172b4d',
      secondaryTextColor: '#5e6c84',
      primaryHoverBackgroundColor: '#E0E2E5',
      secondaryHoverBackgroundColor: '#F5F6F7',
    };

    const { isLoaded, isOpen } = this.state;

    return isOpen ? (
      isLoaded && (
        <FakeTrelloChrome>
          <AtlassianSwitcher
            product="trello"
            disableCustomLinks
            disableRecentContainers
            appearance="standalone"
            theme={trelloTheme}
            isDiscoverSectionEnabled
            recommendationsFeatureFlags={{
              isProductStoreInTrelloJSWFirstEnabled: true,
            }}
            isDiscoverMoreForEveryoneEnabled
            onDiscoverMoreClicked={this.onDiscoverMoreClicked}
            triggerXFlow={this.onTriggerXFlow}
            nonAaMastered={true}
            defaultSignupEmail="aReallyReallyLongEmailAddress@something.email.com"
            onClose={this.onClose}
          />
        </FakeTrelloChrome>
      )
    ) : (
      <Button type="button" onClick={this.openSwitcher}>
        Open switcher
      </Button>
    );
  }
}

export default withIntlProvider(
  withAnalyticsLogger(InlineDialogSwitcherExample),
);
