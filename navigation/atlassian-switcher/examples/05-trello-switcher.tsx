import React from 'react';
import {
  DataTransformer,
  mockAvailableProductsEndpoint,
  mockEndpoints,
} from '@atlaskit/atlassian-switcher-test-utils';
import { withAnalyticsLogger, withIntlProvider } from './helpers';
import {
  AvailableProductsResponse,
  AvailableSite,
  SwitcherProductType,
} from '../src/types';
import AtlassianSwitcher from '../src';
import { Environment } from '../src/common/utils/environment';
import { getAvailableProductsUrl } from '../src/common/providers/trello/products-provider';
import { FakeTrelloChrome } from './helpers/FakeTrelloChrome';

const mockEndpointsDataTransformer: DataTransformer = originalMockData => {
  const availableProducts = originalMockData.AVAILABLE_PRODUCTS_DATA as AvailableProductsResponse;
  return {
    ...originalMockData,
    AVAILABLE_PRODUCTS_DATA: {
      sites: availableProducts.sites
        .map((site: AvailableSite) => {
          site.availableProducts = site.availableProducts.filter(
            availableProduct =>
              ![
                SwitcherProductType.JIRA_SOFTWARE,
                SwitcherProductType.JIRA_BUSINESS,
                SwitcherProductType.JIRA_SERVICE_DESK,
                SwitcherProductType.CONFLUENCE,
                SwitcherProductType.BITBUCKET,
              ].includes(availableProduct.productType),
          );
          return site;
        })
        .filter((site: AvailableSite) => site.availableProducts.length),
    },
  };
};

class InlineDialogSwitcherExample extends React.Component {
  state = {
    isLoaded: false,
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

  render() {
    // colors picked from trello's website. Alpha channel was removed to avoid overlays
    const trelloTheme = {
      primaryTextColor: '#172b4d',
      secondaryTextColor: '#5e6c84',
      primaryHoverBackgroundColor: '#E0E2E5',
      secondaryHoverBackgroundColor: '#F5F6F7',
    };

    return (
      this.state.isLoaded && (
        <FakeTrelloChrome>
          <AtlassianSwitcher
            product="trello"
            disableCustomLinks
            appearance="standalone"
            theme={trelloTheme}
            isDiscoverSectionEnabled
            recommendationsFeatureFlags={{
              isProductStoreInTrelloEnabled: true,
            }}
            onDiscoverMoreClicked={this.onDiscoverMoreClicked}
            triggerXFlow={this.onTriggerXFlow}
          />
        </FakeTrelloChrome>
      )
    );
  }
}

export default withIntlProvider(
  withAnalyticsLogger(InlineDialogSwitcherExample),
);
