import React from 'react';

import Button from '@atlaskit/button/standard-button';
import Drawer from '@atlaskit/drawer';
import { mockEndpoints } from '@atlaskit/atlassian-switcher-test-utils';

import { withAnalyticsLogger, withIntlProvider } from './helpers';
import AtlassianSwitcher from '../src';

class CompassSwitcherExample extends React.Component {
  state = {
    isDrawerOpen: false,
  };

  componentDidMount() {
    this.openDrawer();
  }

  openDrawer = () => {
    mockEndpoints('compass', (originalMockData) => {
      return {
        ...originalMockData,
        AVAILABLE_PRODUCTS_DATA: {
          sites: [
            {
              adminAccess: false,
              availableProducts: [
                {
                  productType: 'JIRA_SOFTWARE',
                },
              ],
              cloudId: '0706eddc-00d7-4e1c-9268-ee3c1d2408cc',
              displayName: 'jira-without-compass',
              url: 'https://jira-with-compass.jira-dev.com',
              avatar: null,
            },
            {
              adminAccess: false,
              availableProducts: [
                {
                  productType: 'JIRA_SOFTWARE',
                },
                {
                  productType: 'COMPASS',
                },
              ],
              cloudId: '0706eddc-00d7-4e1c-9268-ee3c1d2408cc',
              displayName: 'jira-with-compass',
              url: 'https://jira-with-compass.jira-dev.com',
              avatar: null,
            },
          ],
        },
      };
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
            product="compass"
            cloudId="some-cloud-id"
            triggerXFlow={this.onTriggerXFlow}
            enableRecentContainers
          />
        </Drawer>
        <Button type="button" onClick={this.openDrawer}>
          Open user-centric drawer
        </Button>
      </div>
    );
  }
}

export default withIntlProvider(withAnalyticsLogger(CompassSwitcherExample));
