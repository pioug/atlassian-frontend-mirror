import React from 'react';
import Button from '@atlaskit/button/standard-button';
import Drawer from '@atlaskit/drawer';
import {
  mockEndpoints,
  REQUEST_FAST,
} from '@atlaskit/atlassian-switcher-test-utils';
import { withAnalyticsLogger, withIntlProvider } from './helpers';
import AtlassianSwitcher from '../src';
import { enrichFetchError } from '../src/common/utils/fetch';

class JiraSwitcherExample extends React.Component {
  state = {
    isDrawerOpen: false,
  };

  componentDidMount() {
    this.openDrawer();
  }

  openDrawer = () => {
    mockEndpoints(
      'jira',
      originalMockData => {
        return {
          ...originalMockData,
          AVAILABLE_PRODUCTS_DATA: Promise.reject(
            enrichFetchError(new Error('Failed to fetch'), 403),
          ),
        };
      },
      REQUEST_FAST,
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

  render() {
    return (
      <div style={{ padding: '2rem' }}>
        <Drawer onClose={this.onClose} isOpen={this.state.isDrawerOpen}>
          <AtlassianSwitcher product="jira" cloudId="some-cloud-id" />
        </Drawer>
        <Button type="button" onClick={this.openDrawer}>
          Open user-centric drawer
        </Button>
      </div>
    );
  }
}

export default withIntlProvider(withAnalyticsLogger(JiraSwitcherExample));
