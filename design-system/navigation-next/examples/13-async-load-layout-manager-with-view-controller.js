import React, { Component } from 'react';

import { asyncComponent } from 'react-async-component';
import { Route, Switch } from 'react-router';
import { HashRouter } from 'react-router-dom';

import { Label } from '@atlaskit/field-base';
import ToggleStateless from '@atlaskit/toggle';

import {
  AsyncLayoutManagerWithViewController,
  ItemsRenderer,
  NavigationProvider,
  SkeletonContainerView,
  SkeletonItem,
} from '../src';

import ContainerViews from './shared/views/container';

// ==============================
// Skeletons
// ==============================
const ProjectSwitchSkeleton = () => (
  <div
    style={{ background: '#EBECF0', height: '48px', marginBottom: '20px' }}
  />
);

const GlobalNavSkeleton = () => (
  <div style={{ heigth: '100%', background: '#0647A6', width: '64px' }} />
);

// ==============================
// Async components
// ==============================
const AsyncProjectSwitch = asyncComponent({
  resolve: () =>
    import('./shared/components').then(({ ProjectSwitcher }) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          return resolve(ProjectSwitcher);
        }, 2000);
      });
    }),
  LoadingComponent: () => <ProjectSwitchSkeleton />,
});

const AsyncLinkItem = asyncComponent({
  resolve: () =>
    import('./shared/components').then(({ LinkItem }) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          return resolve(LinkItem);
        }, 2000);
      });
    }),
  LoadingComponent: () => <SkeletonItem hasBefore />,
});

const AsyncDefaultGlobalNavigation = asyncComponent({
  resolve: () =>
    import('./shared/components').then(({ DefaultGlobalNavigation }) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          return resolve(DefaultGlobalNavigation);
        }, 3000);
      });
    }),
  LoadingComponent: () => <GlobalNavSkeleton />,
});

const AsyncRoutes = asyncComponent({
  resolve: () =>
    import('./shared/routes').then(
      ({ BacklogView, ProjectsView, DashboardsView, SearchIssuesView }) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const RouteComponent = () => (
              <Switch>
                <Route path="/projects/:projectId" component={BacklogView} />
                <Route path="/projects" component={ProjectsView} />
                <Route path="/issues/search" component={SearchIssuesView} />
                <Route path="/" component={DashboardsView} />
              </Switch>
            );
            return resolve(RouteComponent);
          }, 1000);
        });
      },
    ),
});

const preloadRootViews = import('./shared/views/root');
const AsyncRootViews = asyncComponent({
  resolve: () =>
    preloadRootViews.then(({ default: RootViews }) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          return resolve(RootViews);
        }, 2000);
      });
    }),
});

export default class App extends Component {
  state = {
    isDebugEnabled: true,
    isFlyoutAvailable: true,
  };

  onDebugToggle = () => {
    this.setState((state) => ({ isDebugEnabled: !state.isDebugEnabled }));
  };

  onFlyoutToggle = () => {
    this.setState((state) => ({ isFlyoutAvailable: !state.isFlyoutAvailable }));
  };

  render() {
    const { isDebugEnabled, isFlyoutAvailable } = this.state;

    return (
      <HashRouter>
        <NavigationProvider isDebugEnabled={isDebugEnabled}>
          <AsyncLayoutManagerWithViewController
            customComponents={{
              ProjectSwitcher: AsyncProjectSwitch,
              LinkItem: AsyncLinkItem,
            }}
            experimental_flyoutOnHover={isFlyoutAvailable}
            globalNavigation={AsyncDefaultGlobalNavigation}
            containerSkeleton={() => <SkeletonContainerView type="product" />}
            itemsRenderer={ItemsRenderer}
            firstSkeletonToRender="product"
          >
            <div style={{ padding: 40 }}>
              <AsyncRootViews />
              <ContainerViews />
              <AsyncRoutes />
              <p>
                The search drawer can be opened via the <kbd>/</kbd> keyboard
                shortcut.
              </p>
              <Label label="Toggle flyout on hover (experimental)" />
              <ToggleStateless
                isChecked={isFlyoutAvailable}
                onChange={this.onFlyoutToggle}
              />
              <Label label="Toggle debug logger" />
              <ToggleStateless
                isChecked={isDebugEnabled}
                onChange={this.onDebugToggle}
              />
            </div>
          </AsyncLayoutManagerWithViewController>
        </NavigationProvider>
      </HashRouter>
    );
  }
}
