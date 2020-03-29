import React from 'react';
import Button from '@atlaskit/button';
import { ResultItemGroup, ObjectResult } from '@atlaskit/quick-search';
import Drawer, { DrawerItemTheme } from '../src';

// this example is best illustrated with atlaskit items for children, e.g. search results.

const exampleJiraIconUrl =
  'https://product-fabric.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10318&avatarType=issuetype';

interface State {
  isDrawerOpen: boolean;
}

export default class DrawersExample extends React.Component<{}, State> {
  state = {
    isDrawerOpen: false,
  };

  openDrawer = () =>
    this.setState({
      isDrawerOpen: true,
    });

  closeDrawer = () =>
    this.setState({
      isDrawerOpen: false,
    });

  render() {
    return (
      <div style={{ padding: '20px' }}>
        <Drawer
          onClose={this.closeDrawer}
          isOpen={this.state.isDrawerOpen}
          width="wide"
        >
          <DrawerItemTheme>
            <div style={{ paddingRight: '20px' }}>
              <p>
                Notice that these search results are styled with the Drawer
                theme!
              </p>

              <ResultItemGroup title="Object examples">
                <ObjectResult
                  resultId="result_id_1"
                  name="quick-search is too hilarious!"
                  avatarUrl={exampleJiraIconUrl}
                  objectKey="AK-007"
                  containerName="Search'n'Smarts"
                />
                <ObjectResult
                  resultId="result_id_2"
                  avatarUrl={exampleJiraIconUrl}
                  name="Yeah, I cut my dev loop in half, but you'll never guess what happened next!"
                  containerName="Buzzfluence"
                />
              </ResultItemGroup>
            </div>
          </DrawerItemTheme>
        </Drawer>
        <Button id="button" type="button" onClick={this.openDrawer}>
          Open drawer
        </Button>
      </div>
    );
  }
}
