import React from 'react';
import Button from '@atlaskit/button/standard-button';
import Drawer from '@atlaskit/drawer';
import {
  mockEndpoints,
  REQUEST_MEDIUM,
} from '@atlaskit/atlassian-switcher-test-utils';
import { withAnalyticsLogger, withIntlProvider } from './helpers';
import AtlassianSwitcher from '../src';
import { createAvailableProductsProvider } from '../src/create-custom-provider';

const customAvailableProductsDataProvider = createAvailableProductsProvider(
  '/gateway/api/available-products/api/available-products',
);

class BitbucketSwitcherExample extends React.Component {
  state = {
    isDrawerOpen: false,
  };

  componentDidMount() {
    this.openDrawer();
  }

  openDrawer = () => {
    mockEndpoints(
      'bitbucket',
      originalMockData => {
        return {
          ...originalMockData,
          AVAILABLE_PRODUCTS_DATA: {
            sites: [
              {
                adminAccess: false,
                availableProducts: [
                  {
                    productType: 'BITBUCKET',
                    url: null,
                  },
                ],
                cloudId: 'bitbucket',
                displayName: 'random-instance',
                url: 'https://some-random-instance.atlassian.net',
                avatar:
                  'https://site-admin-avatar-cdn.staging.public.atl-paas.net/avatars/240/rings.png',
              },
            ],
          },
          XFLOW_SETTINGS: {
            'product-suggestions-enabled': false,
          },
        };
      },
      REQUEST_MEDIUM,
    );
    this.setState({
      isDrawerOpen: true,
    });
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

  onDiscoverMoreClicked = () => {
    console.log(`Triggering discover more!`);
  };

  render() {
    return (
      <div style={{ padding: '2rem' }}>
        <Drawer onClose={this.onClose} isOpen={this.state.isDrawerOpen}>
          <AtlassianSwitcher
            product="bitbucket"
            availableProductsDataProvider={customAvailableProductsDataProvider}
            triggerXFlow={this.onTriggerXFlow}
            isDiscoverSectionEnabled
            isEmceeLinkEnabled
            onDiscoverMoreClicked={this.onDiscoverMoreClicked}
            disableRecentContainers
          />
        </Drawer>
        <Button type="button" onClick={this.openDrawer}>
          Open drawer
        </Button>
      </div>
    );
  }
}

export default withIntlProvider(withAnalyticsLogger(BitbucketSwitcherExample));
