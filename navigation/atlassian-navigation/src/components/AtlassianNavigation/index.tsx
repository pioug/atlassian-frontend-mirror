/** @jsx jsx */
import { jsx } from '@emotion/core';

import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';

import { defaultTheme, ThemeProvider } from '../../theme';
import { PrimaryItemsContainer } from '../PrimaryItemsContainer';

import { containerCSS, leftCSS, rightCSS } from './styles';
import { AtlassianNavigationProps } from './types';

const analyticsData = {
  attributes: { navigationLayer: 'global' },
  componentName: 'atlassianNavigation',
};

export const AtlassianNavigation = (props: AtlassianNavigationProps) => {
  const {
    label: label,
    primaryItems = [],
    renderAppSwitcher: AppSwitcher,
    renderCreate: create,
    renderHelp: Help,
    renderNotifications: Notifications,
    renderProductHome: ProductHome,
    renderProfile: Profile,
    renderSearch: Search,
    renderSignIn: SignIn,
    renderSettings: Settings,
    moreLabel = '…',
    theme = defaultTheme,
    testId,
  } = props;

  return (
    <ThemeProvider value={theme}>
      <NavigationAnalyticsContext data={analyticsData}>
        <header
          css={containerCSS(theme)}
          data-testid={testId && `${testId}-header`}
          role="banner"
        >
          <nav css={leftCSS} aria-label={label}>
            {AppSwitcher && <AppSwitcher />}
            {ProductHome && <ProductHome />}
            <PrimaryItemsContainer
              testId={testId}
              moreLabel={moreLabel}
              items={primaryItems}
              create={create}
              theme={theme}
            />
          </nav>

          <div
            css={rightCSS}
            data-testid={testId && `${testId}-secondary-actions`}
          >
            {Search && <Search />}
            {Notifications && <Notifications />}
            {Help && <Help />}
            {Settings && <Settings />}
            {SignIn && <SignIn />}
            {Profile && <Profile />}
          </div>
        </header>
      </NavigationAnalyticsContext>
    </ThemeProvider>
  );
};

export default AtlassianNavigation;
