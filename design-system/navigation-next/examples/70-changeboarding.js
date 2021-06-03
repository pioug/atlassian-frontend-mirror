import React, { Component, Fragment } from 'react';

import Button from '@atlaskit/button/standard-button';
import ChevronLeft from '@atlaskit/icon/glyph/chevron-left';
import ChevronRight from '@atlaskit/icon/glyph/chevron-right';
import { Spotlight, SpotlightManager } from '@atlaskit/onboarding';

import {
  GlobalNav,
  LayoutManagerWithViewController,
  NavigationProvider,
  // UIController was coming as type.
  // eslint-disable-next-line no-unused-vars
  UIController,
  UIControllerSubscriber,
  withNavigationUIController,
} from '../src';

const GlobalNavigation = () => (
  <GlobalNav primaryItems={[]} secondaryItems={[]} />
);

const ExpandToggleButton = () => (
  <UIControllerSubscriber>
    {(navigationUIController) => (
      <Button
        iconBefore={
          navigationUIController.state.isCollapsed ? (
            <ChevronRight />
          ) : (
            <ChevronLeft />
          )
        }
        onClick={navigationUIController.toggleCollapse}
      >
        {navigationUIController.state.isCollapsed ? 'Expand' : 'Collapse'} the
        navigation
      </Button>
    )}
  </UIControllerSubscriber>
);

class Example extends Component {
  state = {
    isChangeboardingOpen: this.props.navigationUIController.state.isCollapsed,
    spotlightTargetNode: null,
  };

  openChangeboarding = () => {
    this.setState({ isChangeboardingOpen: true });
  };

  closeChangeboarding = () => {
    this.setState({ isChangeboardingOpen: false });
  };

  getCollapseAffordanceRef = ({ expandCollapseAffordance }) => {
    if (
      expandCollapseAffordance &&
      expandCollapseAffordance.current &&
      expandCollapseAffordance.current !== this.state.spotlightTargetNode
    ) {
      this.setState({ spotlightTargetNode: expandCollapseAffordance.current });
    }
  };

  render() {
    const { isChangeboardingOpen, spotlightTargetNode } = this.state;

    return (
      <Fragment>
        <LayoutManagerWithViewController
          globalNavigation={GlobalNavigation}
          onCollapseEnd={this.openChangeboarding}
          getRefs={this.getCollapseAffordanceRef}
        >
          <div css={{ padding: '32px 40px' }}>
            <ExpandToggleButton />
          </div>
        </LayoutManagerWithViewController>
        {isChangeboardingOpen && spotlightTargetNode && (
          <Spotlight
            actions={[{ onClick: this.closeChangeboarding, text: 'Close' }]}
            dialogPlacement="right bottom"
            heading="We've got a new collapse state"
            targetNode={spotlightTargetNode}
            targetRadius={16}
          >
            <div>Awww yeah.</div>
          </Spotlight>
        )}
      </Fragment>
    );
  }
}
const ExampleWithNavigationUI = withNavigationUIController(Example);

export default () => (
  <NavigationProvider>
    <SpotlightManager>
      <ExampleWithNavigationUI />
    </SpotlightManager>
  </NavigationProvider>
);
