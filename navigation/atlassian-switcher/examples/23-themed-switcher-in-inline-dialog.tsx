import React from 'react';
import Button from '@atlaskit/button/standard-button';
import InlineDialog from '@atlaskit/inline-dialog';
import {
  mockEndpoints,
  REQUEST_FAST,
} from '@atlaskit/atlassian-switcher-test-utils';
import { withAnalyticsLogger, withIntlProvider } from './helpers';
import AtlassianSwitcher from '../src';

class InlineDialogSwitcherExample extends React.Component {
  state = {
    isOpen: false,
  };

  openDrawer = () => {
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
      REQUEST_FAST,
    );
    this.setState({
      isOpen: true,
    });
  };

  onClose = () => {
    this.setState({
      isOpen: false,
    });
  };

  onTriggerXFlow = (productKey: string, sourceComponent: string) => {
    console.log(
      `Triggering xflow for => ${productKey} from ${sourceComponent}`,
    );
  };

  render() {
    const redishColorScheme = {
      primaryTextColor: '#8B0000',
      secondaryTextColor: '#ff4c4c',
      primaryHoverBackgroundColor: '#ffcccc',
      secondaryHoverBackgroundColor: '#ffe5e5',
    };

    return (
      <InlineDialog
        onClose={this.onClose}
        isOpen={this.state.isOpen}
        content={
          <div
            style={{
              maxHeight: 'inherit',
              maxWidth: 'inherit',
              overflow: 'auto',
            }}
          >
            <AtlassianSwitcher
              product="trello"
              disableCustomLinks
              disableSwitchToHeading
              cloudId="some-cloud-id"
              triggerXFlow={this.onTriggerXFlow}
              theme={redishColorScheme}
              appearance="standalone"
            />
          </div>
        }
      >
        <Button type="button" onClick={this.openDrawer}>
          Click to open inline dialog
        </Button>
      </InlineDialog>
    );
  }
}

export default withIntlProvider(
  withAnalyticsLogger(InlineDialogSwitcherExample),
);
