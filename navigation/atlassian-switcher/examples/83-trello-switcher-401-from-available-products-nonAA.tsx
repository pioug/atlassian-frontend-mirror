import React from 'react';
import {
  DataTransformer,
  mockAvailableProductsEndpoint,
  mockEndpoints,
} from '@atlaskit/atlassian-switcher-test-utils';
import Button from '@atlaskit/button/standard-button';
import { withAnalyticsLogger, withIntlProvider } from './helpers';
import AtlassianSwitcher, { createAvailableProductsProvider } from '../src';
import { FakeTrelloChrome } from './helpers/FakeTrelloChrome';
import {
  createJoinableSitesProvider,
  defaultJoinableSitesFetch,
} from '../src/index';

const NEW_AVAILABLE_PRODUCTS_ENDPOINT =
  '/proxy/experiment-api/trello-cross-product-join/available-sites';

const mockEndpointsDataTransformer: DataTransformer = originalMockData => {
  return {
    ...originalMockData,
    AVAILABLE_PRODUCTS_DATA: 401,
  };
};

const joinableSitesDataProvider = createJoinableSitesProvider(
  defaultJoinableSitesFetch('/gateway/api'),
);
const availableProductsDataProvider = createAvailableProductsProvider(
  NEW_AVAILABLE_PRODUCTS_ENDPOINT,
);

class InlineDialogSwitcherExample extends React.Component {
  state = {
    isLoaded: false,
    isOpen: true,
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    mockEndpoints('trello', mockEndpointsDataTransformer);
    mockAvailableProductsEndpoint(
      NEW_AVAILABLE_PRODUCTS_ENDPOINT,
      mockEndpointsDataTransformer,
    );
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
            appearance="standalone"
            theme={trelloTheme}
            isDiscoverSectionEnabled
            recommendationsFeatureFlags={{
              isProductStoreInTrelloEnabled: true,
            }}
            onDiscoverMoreClicked={this.onDiscoverMoreClicked}
            triggerXFlow={this.onTriggerXFlow}
            joinableSitesDataProvider={joinableSitesDataProvider}
            availableProductsDataProvider={availableProductsDataProvider}
            defaultSignupEmail="email@email.com"
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
