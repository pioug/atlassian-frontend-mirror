import React, { Fragment } from 'react';

import { Route, Switch } from 'react-router';
import { MemoryRouter } from 'react-router-dom';

import AppNavigation from '@atlaskit/atlassian-navigation/examples/10-authenticated-example';
import Banner from '@atlaskit/banner';
import WarningIcon from '@atlaskit/icon/glyph/warning';

import { LayoutManagerWithViewController, NavigationProvider } from '../src';

import { LinkItem, ProjectSwitcher } from './shared/components';
import { DummySkeletonContent } from './shared/components/DummySkeletonContent';
import { routes } from './shared/routes';
import ContainerViews from './shared/views/container';
import RootViews from './shared/views/root';

const BANNER_HEIGHT = 52;

const Icon = <WarningIcon label="Warning icon" secondaryColor="inherit" />;

const WarningBanner = () => (
  <div
    style={{
      height: BANNER_HEIGHT,
      left: 0,
      position: 'fixed',
      top: 0,
      width: '100%',
    }}
  >
    <Banner appearance="warning" icon={Icon} isOpen>
      Banner
    </Banner>
  </div>
);

const customComponents = {
  LinkItem,
  ProjectSwitcher,
};

const containerStyle = {
  padding: 40,
  height: 2000,
};

const HorizontalNavigationWithBanner = () => {
  const topOffset = BANNER_HEIGHT;

  return (
    <MemoryRouter>
      <NavigationProvider>
        <Fragment>
          <WarningBanner />
          <LayoutManagerWithViewController
            customComponents={customComponents}
            experimental_flyoutOnHover
            experimental_alternateFlyoutBehaviour
            experimental_horizontalGlobalNav
            globalNavigation={AppNavigation}
            topOffset={topOffset}
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
        </Fragment>
      </NavigationProvider>
    </MemoryRouter>
  );
};

export default HorizontalNavigationWithBanner;
