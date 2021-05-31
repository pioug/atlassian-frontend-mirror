import React from 'react';
import Button from '@atlaskit/button/standard-button';
import Drawer from '@atlaskit/drawer';
import {
  mockEndpoints,
  REQUEST_MEDIUM,
} from '@atlaskit/atlassian-switcher-test-utils';
import { withAnalyticsLogger, withIntlProvider } from './helpers';
import AtlassianSwitcher, { AtlassianSwitcherPrefetchTrigger } from '../src';
import { resetAll } from '../src/common/providers/instance-data-providers';
import { resetAvailableProducts } from '../src/common/providers/products-data-provider';

class GenericSwitcherExample extends React.Component {
  state = {
    isDrawerOpen: false,
  };

  componentDidMount() {
    mockEndpoints(
      'jira',
      (originalMockData) => {
        return {
          ...originalMockData,
          RECENT_CONTAINERS_DATA: {
            data: [],
          },
          CUSTOM_LINKS_DATA: {
            data: [],
          },
          XFLOW_SETTINGS: {},
        };
      },
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
    resetAvailableProducts();
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
            disableSwitchToHeading
            triggerXFlow={this.onTriggerXFlow}
          />
        </Drawer>
        <div style={{ display: 'flex' }}>
          <AtlassianSwitcherPrefetchTrigger>
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
