import React from 'react';
import {
  mockEndpoints,
  REQUEST_FAST,
} from '@atlaskit/atlassian-switcher-test-utils';
import { withAnalyticsLogger, withIntlProvider } from './helpers';
import AtlassianSwitcher from '../src';
import styled from 'styled-components';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import ColorScheme from './helpers/ColorScheme';

const Container = styled.div`
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0 8px;
  display: inline-block;
  margin: 5px;
  vertical-align: top;
`;
class InlineDialogSwitcherExample extends React.Component {
  state = {
    isLoaded: false,
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

  render() {
    const greenishColorScheme = {
      primaryTextColor: '#006400',
      secondaryTextColor: '#4ca64c',
      primaryHoverBackgroundColor: '#cce5cc',
      secondaryHoverBackgroundColor: '#e5f2e5',
    };

    return (
      this.state.isLoaded && (
        <Page>
          <Grid layout="fixed">
            <GridColumn medium={8}>
              <Container>
                <AtlassianSwitcher
                  product="trello"
                  disableCustomLinks
                  disableSwitchToHeading
                  isDiscoverMoreForEveryoneEnabled
                  cloudId="some-cloud-id"
                  triggerXFlow={this.onTriggerXFlow}
                  appearance="standalone"
                  theme={greenishColorScheme}
                />
              </Container>
            </GridColumn>
            <GridColumn medium={4}>
              <ColorScheme colorScheme={greenishColorScheme} />
            </GridColumn>
          </Grid>
        </Page>
      )
    );
  }
}

export default withIntlProvider(
  withAnalyticsLogger(InlineDialogSwitcherExample),
);
