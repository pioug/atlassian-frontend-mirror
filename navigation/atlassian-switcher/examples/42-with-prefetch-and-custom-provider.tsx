import React, { Component } from 'react';
import Button from '@atlaskit/button/standard-button';
import Drawer from '@atlaskit/drawer';
import {
  mockAvailableProductsEndpoint,
  REQUEST_MEDIUM,
  availableProductsUrlRegex,
} from '@atlaskit/atlassian-switcher-test-utils';
import { withAnalyticsLogger, withIntlProvider } from './helpers';
import AtlassianSwitcher, { AtlassianSwitcherPrefetchTrigger } from '../src';
import { resetAll } from '../src/common/providers/instance-data-providers';
import { resetAvailableProducts } from '../src/common/providers/products-data-provider';
import { createAvailableProductsProvider } from '../src/common/providers/default-available-products-provider';
import { createJoinableSitesProvider } from '../src/create-custom-provider';
import mockJoinableSites from '../test-helpers/mockJoinableSites';
import { JoinableSitesResponse } from '../src/types';

const customAvailableProductsDataProvider = createAvailableProductsProvider();

const fetchJoinableSites: () => Promise<JoinableSitesResponse> = () =>
  new Promise(resolve => {
    setTimeout(
      () =>
        resolve({ sites: mockJoinableSites.sites } as JoinableSitesResponse),
      1000,
    );
  });

const customJoinableSitesDataProvider = createJoinableSitesProvider(
  fetchJoinableSites,
);

const identityTransformer = (originalMockData: any) => originalMockData;

class GenericSwitcherExample extends Component {
  state = {
    isDrawerOpen: false,
  };

  componentDidMount() {
    mockAvailableProductsEndpoint(
      availableProductsUrlRegex,
      identityTransformer,
      REQUEST_MEDIUM,
    );
  }

  openDrawer = () => {
    this.setState({
      isDrawerOpen: true,
    });
  };

  clearCache = () => {
    resetAll();
    resetAvailableProducts(customAvailableProductsDataProvider);
  };

  onClose = () => {
    this.setState({
      isDrawerOpen: false,
    });
  };

  onTriggerXFlow = (productKey: string, sourceComponent: string) => {
    console.log(
      `Triggering xflow for => ${productKey} from ${sourceComponent}`,
    );
  };

  render() {
    return (
      <div style={{ padding: '2rem' }}>
        <Drawer onClose={this.onClose} isOpen={this.state.isDrawerOpen}>
          <AtlassianSwitcher
            product="trello"
            disableCustomLinks
            disableRecentContainers
            disableSwitchToHeading
            triggerXFlow={this.onTriggerXFlow}
            availableProductsDataProvider={customAvailableProductsDataProvider}
            joinableSitesDataProvider={customJoinableSitesDataProvider}
          />
        </Drawer>
        <div style={{ display: 'flex' }}>
          <AtlassianSwitcherPrefetchTrigger
            availableProductsDataProvider={customAvailableProductsDataProvider}
            joinableSitesDataProvider={customJoinableSitesDataProvider}
          >
            <Button type="button" onClick={this.openDrawer}>
              Open drawer
            </Button>
          </AtlassianSwitcherPrefetchTrigger>
          <div style={{ width: 16 }} />
          <Button type="button" onClick={this.clearCache}>
            Clear cache
          </Button>
        </div>
      </div>
    );
  }
}

export default withIntlProvider(withAnalyticsLogger(GenericSwitcherExample));
