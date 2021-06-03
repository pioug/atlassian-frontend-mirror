import React, { Component } from 'react';

/*
 * Routing and Server Side Rendering
 * Make sure you correctly configure your
 * application's routes to be compatible
 * with SSR. For instructions on how to
 * SSR with React Router, check out their docs:
 * https://reacttraining.com/react-router/web/guides/server-rendering
 */

import { Route, Switch } from 'react-router';
import { MemoryRouter } from 'react-router-dom';

import { Label } from '@atlaskit/field-base';
import Toggle from '@atlaskit/toggle';

import { LayoutManagerWithViewController, NavigationProvider } from '../src';

import {
  DefaultGlobalNavigation,
  LinkItem,
  ProjectSwitcher,
} from './shared/components';
import {
  BacklogView,
  DashboardsView,
  ProjectsView,
  SearchIssuesView,
} from './shared/routes';
import ContainerViews from './shared/views/container';
import RootViews from './shared/views/root';

export default class App extends Component {
  state = {
    isDebugEnabled: true,
    isFlyoutAvailable: true,
    isAlternateFlyoutBehaviourEnabled: true,
    isFullWitdhFlyoutEnabled: false,
    isHideNavVisuallyEnabled: false,
    showContextualNavigation: true,
  };

  onDebugToggle = () => {
    this.setState((state) => ({ isDebugEnabled: !state.isDebugEnabled }));
  };

  onFlyoutToggle = () => {
    this.setState((state) => ({ isFlyoutAvailable: !state.isFlyoutAvailable }));
  };

  onAlternateBehaviourToggle = () => {
    this.setState((state) => ({
      isAlternateFlyoutBehaviourEnabled: !state.isAlternateFlyoutBehaviourEnabled,
    }));
  };

  onFullWidthFlyoutToggle = () => {
    this.setState((state) => ({
      isFullWitdhFlyoutEnabled: !state.isFullWitdhFlyoutEnabled,
    }));
  };

  onHideNavVisuallyToggle = () => {
    this.setState((state) => ({
      isHideNavVisuallyEnabled: !state.isHideNavVisuallyEnabled,
    }));
  };

  onToggleContextualNavigation = () => {
    this.setState((state) => ({
      showContextualNavigation: !state.showContextualNavigation,
    }));
  };

  render() {
    const {
      isDebugEnabled,
      isFlyoutAvailable,
      isAlternateFlyoutBehaviourEnabled,
      isFullWitdhFlyoutEnabled,
      isHideNavVisuallyEnabled,
      showContextualNavigation,
    } = this.state;

    return (
      <MemoryRouter>
        <NavigationProvider isDebugEnabled={isDebugEnabled}>
          <LayoutManagerWithViewController
            customComponents={{ LinkItem, ProjectSwitcher }}
            experimental_flyoutOnHover={isFlyoutAvailable}
            experimental_hideNavVisuallyOnCollapse={isHideNavVisuallyEnabled}
            experimental_alternateFlyoutBehaviour={
              isAlternateFlyoutBehaviourEnabled
            }
            experimental_fullWidthFlyout={isFullWitdhFlyoutEnabled}
            globalNavigation={DefaultGlobalNavigation}
            showContextualNavigation={showContextualNavigation}
          >
            <div style={{ padding: 40 }}>
              <RootViews />
              <ContainerViews />
              <Switch>
                <Route path="/projects/:projectId" component={BacklogView} />
                <Route path="/projects" component={ProjectsView} />
                <Route path="/issues/search" component={SearchIssuesView} />
                <Route path="/" component={DashboardsView} />
              </Switch>

              <p>
                The search drawer can be opened via the <kbd>/</kbd> keyboard
                shortcut.
              </p>
              <Label label="Toggle flyout on hover (experimental)" />
              <Toggle
                isChecked={isFlyoutAvailable}
                onChange={this.onFlyoutToggle}
              />
              <Label label="Toggle alternate hover behaviour (experimental)" />
              <Toggle
                isChecked={isAlternateFlyoutBehaviourEnabled}
                onChange={this.onAlternateBehaviourToggle}
              />
              <Label label="Toggle full width flyout (experimental)" />
              <Toggle
                isChecked={isFullWitdhFlyoutEnabled}
                onChange={this.onFullWidthFlyoutToggle}
              />
              <Label label="Hide nav visually on collapse" />
              <Toggle
                isChecked={isHideNavVisuallyEnabled}
                onChange={this.onHideNavVisuallyToggle}
              />
              <Label label="Toggle contextual navigation" />
              <Toggle
                isChecked={showContextualNavigation}
                onChange={this.onToggleContextualNavigation}
              />
              <Label label="Toggle debug logger" />
              <Toggle
                isChecked={isDebugEnabled}
                onChange={this.onDebugToggle}
              />
            </div>
          </LayoutManagerWithViewController>
        </NavigationProvider>
      </MemoryRouter>
    );
  }
}
