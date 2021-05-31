import React from 'react';
import Button from '@atlaskit/button/standard-button';
import Drawer from '@atlaskit/drawer';
import { mockEndpoints } from '@atlaskit/atlassian-switcher-test-utils';
import { withAnalyticsLogger, withIntlProvider } from './helpers';
import AtlassianSwitcher from '../src';
import { createJoinableSitesProvider } from '../src/cross-join/providers/default-joinable-sites-provider';
import { JoinableSitesResponse } from '../src/types';
import mockJoinableSites from '../test-helpers/mockJoinableSites';

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

class GenericSwitcherWithJoinExample extends React.Component {
  state = {
    isDrawerOpen: false,
  };

  componentDidMount() {
    this.openDrawer();
  }

  openDrawer = () => {
    mockEndpoints('confluence', (originalMockData) => originalMockData, {
      containers: 1000,
      xflow: 500,
      permitted: 2000,
      appswitcher: 1500,
    });

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

  render() {
    return (
      <div style={{ padding: '2rem' }}>
        <Drawer onClose={this.onClose} isOpen={this.state.isDrawerOpen}>
          <AtlassianSwitcher
            product="generic-product"
            cloudId="some-cloud-id"
            joinableSitesDataProvider={customJoinableSitesDataProvider}
            onClose={this.onClose}
          />
        </Drawer>
        <Button type="button" onClick={this.openDrawer}>
          Open drawer
        </Button>
      </div>
    );
  }
}

export default withIntlProvider(
  withAnalyticsLogger(GenericSwitcherWithJoinExample),
);
