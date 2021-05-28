import React, { Component } from 'react';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import {
  mockEndpoints,
  REQUEST_FAST,
} from '@atlaskit/atlassian-switcher-test-utils';
import { withAnalyticsLogger, withIntlProvider } from './helpers';
import AtlassianSwitcher from '../src';
import styled from 'styled-components';

const Container = styled.div`
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0 8px;
  display: inline-block;
  margin: 5px;
  vertical-align: top;
`;

class InlineDialogSwitcherExample extends Component {
  state = {
    isLoaded: false,
    isOpen: false,
  };

  componentDidMount() {
    this.loadData();
  }
  loadData = () => {
    mockEndpoints(
      'jira',
      originalMockData => {
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
      isLoaded: true,
    });
  };

  onTriggerXFlow = (productKey: string, sourceComponent: string) => {
    console.log(
      `Triggering xflow for => ${productKey} from ${sourceComponent}`,
    );
  };

  openModal = () => this.setState({ isOpen: true });

  closeModal = () => this.setState({ isOpen: false });

  render() {
    return (
      this.state.isLoaded && (
        <Container>
          <ModalTransition>
            {this.state.isOpen && (
              <Modal onClose={this.closeModal}>Integration modal</Modal>
            )}
          </ModalTransition>
          <AtlassianSwitcher
            product="jira"
            disableCustomLinks
            disableSwitchToHeading
            isSlackDiscoveryEnabled
            slackDiscoveryClickHandler={this.openModal}
            onDiscoverMoreClicked={() => {}}
            cloudId="some-cloud-id"
            triggerXFlow={this.onTriggerXFlow}
            appearance="standalone"
          />
        </Container>
      )
    );
  }
}

export default withIntlProvider(
  withAnalyticsLogger(InlineDialogSwitcherExample),
);
