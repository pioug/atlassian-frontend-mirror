import React from 'react';
import Button from '@atlaskit/button/custom-theme-button';
import Drawer from '@atlaskit/drawer';
import { mockEndpoints } from '@atlaskit/atlassian-switcher-test-utils';
import { withAnalyticsLogger, withIntlProvider } from './helpers';
import AtlassianSwitcher from '../src';

class StartSwitcherExample extends React.Component {
  state = {
    isDrawerOpen: false,
  };

  componentDidMount() {
    this.openDrawer();
  }

  openDrawer = () => {
    mockEndpoints('start', originalMockData => {
      return {
        ...originalMockData,
        AVAILABLE_PRODUCTS_DATA: {
          sites: [
            {
              adminAccess: true,
              availableProducts: [
                {
                  productType: 'JIRA_SOFTWARE',
                  url: null,
                },
              ],
              cloudId: '0706eddc-00d7-4e1c-9268-ee3c1d2408cc',
              displayName: 'mocked-jira-instance',
              url: null,
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

  onDiscoverMoreClicked = () => {
    console.log(`Triggering discover more!`);
  };

  render() {
    return (
      <div style={{ padding: '2rem' }}>
        <Drawer onClose={this.onClose} isOpen={this.state.isDrawerOpen}>
          <AtlassianSwitcher
            product="start"
            triggerXFlow={this.onTriggerXFlow}
            isDiscoverSectionEnabled
            isDiscoverMoreForEveryoneEnabled
            onDiscoverMoreClicked={this.onDiscoverMoreClicked}
          />
        </Drawer>
        <Button type="button" onClick={this.openDrawer}>
          Open drawer
        </Button>
      </div>
    );
  }
}

export default withIntlProvider(withAnalyticsLogger(StartSwitcherExample));
