import React from 'react';

import {
  AppSwitcher,
  AtlassianNavigation,
  PrimaryButton,
} from '@atlaskit/atlassian-navigation';
import {
  LayoutManagerWithViewController,
  NavigationProvider,
} from '@atlaskit/navigation-next';
import { mockEndpoints } from '@atlaskit/atlassian-switcher-test-utils';
import Popup from '@atlaskit/popup';

import { withAnalyticsLogger, withIntlProvider } from './helpers';
import AtlassianSwitcher, {
  createJoinableSitesProvider,
  defaultJoinableSitesFetch,
} from '../src';

const joinableSitesDataProvider = createJoinableSitesProvider(
  defaultJoinableSitesFetch('/gateway/api'),
);

const AppSwitcherExample = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleAppSwitcher = React.useCallback(() => setIsOpen(!isOpen), [
    isOpen,
  ]);
  const closeAppSwitcher = React.useCallback(() => setIsOpen(false), []);

  return (
    <Popup
      placement="bottom-start"
      rootBoundary="document"
      onClose={closeAppSwitcher}
      isOpen={isOpen}
      content={() => (
        <div
          style={{
            width: '400px',
            maxHeight: 'calc(100vh - 79px)',
            overflowX: 'hidden',
          }}
        >
          <h3
            style={{
              padding: '16px 24px 8px',
            }}
          >
            Switch To
          </h3>
          <div
            style={{
              padding: '0 16px 0',
            }}
          >
            <AtlassianSwitcher
              product="generic-product"
              cloudId="some-cloud-id"
              joinableSitesDataProvider={joinableSitesDataProvider}
              disableSwitchToHeading
            />
          </div>
        </div>
      )}
      zIndex={800}
      trigger={triggerProps => (
        <AppSwitcher
          tooltip="Switch to..."
          onClick={toggleAppSwitcher}
          {...triggerProps}
        />
      )}
    />
  );
};

const primaryItems = [
  <PrimaryButton>Projects</PrimaryButton>,
  <PrimaryButton>Issues</PrimaryButton>,
  <PrimaryButton>Dashboards</PrimaryButton>,
];

const Navigation = () => (
  <AtlassianNavigation
    label="site"
    renderProductHome={() => null}
    primaryItems={primaryItems}
    renderAppSwitcher={AppSwitcherExample}
  />
);

const SwitcherInExperimentalAppNavigationExample = () => {
  React.useEffect(() => {
    mockEndpoints('confluence', originalMockData => originalMockData, {
      containers: 1000,
      xflow: 500,
      permitted: 2000,
      appswitcher: 1500,
    });
  }, []);

  return (
    <NavigationProvider>
      <LayoutManagerWithViewController
        experimental_flyoutOnHover
        experimental_alternateFlyoutBehaviour
        experimental_horizontalGlobalNav
        globalNavigation={Navigation}
      />
    </NavigationProvider>
  );
};

export default withIntlProvider(
  withAnalyticsLogger(SwitcherInExperimentalAppNavigationExample),
);
