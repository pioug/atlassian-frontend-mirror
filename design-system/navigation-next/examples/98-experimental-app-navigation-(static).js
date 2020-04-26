import React from 'react';

import { Route, Switch } from 'react-router';
import { MemoryRouter } from 'react-router-dom';

import AuthenticatedAppNavigationExample from '@atlaskit/atlassian-navigation/examples/10-authenticated-example';

import { LayoutManagerWithViewController, NavigationProvider } from '../src';

import { LinkItem, ProjectSwitcher } from './shared/components';
import { DummySkeletonContent } from './shared/components/DummySkeletonContent';
import { routes } from './shared/routes';
import ContainerViews from './shared/views/container';
import RootViews from './shared/views/root';

const containerStyle = {
  padding: 40,
};

const customComponents = {
  LinkItem,
  ProjectSwitcher,
};

const StaticHorizontalNavigationApp = () => (
  <MemoryRouter>
    <NavigationProvider>
      <LayoutManagerWithViewController
        customComponents={customComponents}
        experimental_flyoutOnHover
        experimental_alternateFlyoutBehaviour
        experimental_horizontalGlobalNav
        globalNavigation={AuthenticatedAppNavigationExample}
      >
        <div style={containerStyle}>
          <RootViews />
          <ContainerViews />
          <Switch>
            {routes.map(({ component, path }) => (
              <Route key={path} component={component} path={path} />
            ))}
          </Switch>
          <DummySkeletonContent />
        </div>
      </LayoutManagerWithViewController>
    </NavigationProvider>
  </MemoryRouter>
);

export default StaticHorizontalNavigationApp;
