import React from 'react';
import Button from '@atlaskit/button/standard-button';
import Drawer from '@atlaskit/drawer';
import { mockEndpoints } from '@atlaskit/atlassian-switcher-test-utils';
import { withAnalyticsLogger, withIntlProvider } from './helpers';
import AtlassianSwitcher, { SwitcherProductType } from '../src';

class ConfluenceSwitcherExample extends React.Component {
  state = {
    isDrawerOpen: false,
  };

  componentDidMount() {
    this.openDrawer();
  }

  openDrawer = () => {
    mockEndpoints('confluence');
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
    const mockExtendedAnalyticsAttributes = {
      originProduct: 'confluence',
      originGeneratedId: '1234',
    };
    return (
      <div style={{ padding: '2rem' }}>
        <Drawer onClose={this.onClose} isOpen={this.state.isDrawerOpen}>
          <AtlassianSwitcher
            product="confluence"
            cloudId="some-cloud-id"
            triggerXFlow={this.onTriggerXFlow}
            customizeLinks={() => ({
              mapUrl: (url, product) => {
                if (product === SwitcherProductType.CONFLUENCE) {
                  return `${url}?atlOrigin='1234'`;
                }
                return url;
              },
              getExtendedAnalyticsAttributes: product =>
                product === SwitcherProductType.CONFLUENCE
                  ? mockExtendedAnalyticsAttributes
                  : {},
            })}
          />
        </Drawer>
        <Button type="button" onClick={this.openDrawer}>
          Open drawer
        </Button>
      </div>
    );
  }
}

export default withIntlProvider(withAnalyticsLogger(ConfluenceSwitcherExample));
