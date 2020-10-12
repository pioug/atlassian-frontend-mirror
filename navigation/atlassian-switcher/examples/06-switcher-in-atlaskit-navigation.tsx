import React from 'react';
import { AtlassianIcon } from '@atlaskit/logo';
import Navigation, { AkGlobalItem } from '@atlaskit/navigation';
import Tooltip from '@atlaskit/tooltip';
import SwitcherIcon from '@atlaskit/icon/glyph/app-switcher';
import * as colors from '@atlaskit/theme/colors';
import AkDrawer from '@atlaskit/drawer';
import { mockEndpoints } from '@atlaskit/atlassian-switcher-test-utils';
import { withAnalyticsLogger, withIntlProvider } from './helpers';
import AtlassianSwitcher from '../src';

class ConfluenceSwitcherExample extends React.Component {
  state = {
    isDrawerOpen: false,
  };

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
    return (
      <Navigation
        drawers={[
          <AkDrawer
            key="switcher"
            isOpen={this.state.isDrawerOpen}
            onClose={this.onClose}
          >
            <AtlassianSwitcher
              product="confluence"
              cloudId="some-cloud-id"
              triggerXFlow={this.onTriggerXFlow}
            />
          </AkDrawer>,
        ]}
        globalPrimaryIcon={<AtlassianIcon size="large" label="Atlassian" />}
        globalPrimaryItemHref="/"
        globalSecondaryActions={[
          <AkGlobalItem key="switcher-global-item" onClick={this.openDrawer}>
            <Tooltip content="Switch apps" position="right">
              <SwitcherIcon
                label="Switch apps"
                size="medium"
                primaryColor={colors.N0}
                secondaryColor={colors.N800}
              />
            </Tooltip>
          </AkGlobalItem>,
        ]}
      />
    );
  }
}

export default withIntlProvider(withAnalyticsLogger(ConfluenceSwitcherExample));
