/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import { N30A, N40A, N900 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { HORIZONTAL_GLOBAL_NAV_HEIGHT } from '../../common/constants';
import { defaultTheme, hexToRGBA, ThemeProvider } from '../../theme';
import { PrimaryItemsContainer } from '../PrimaryItemsContainer';

import { AtlassianNavigationProps } from './types';

const containerStyles = css({
  display: 'flex',
  boxSizing: 'border-box',
  height: HORIZONTAL_GLOBAL_NAV_HEIGHT,
  paddingRight: token('space.150', '12px'),
  paddingLeft: token('space.150', '12px'),
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '[data-color-mode="light"] &, [data-color-mode="dark"] &': {
    // eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
    borderBottom: `1px solid ${token('color.border')}`,

    // TODO: (DSP-2087) Remove the below once tokens have launched
    '&::after': {
      content: 'none',
    },
  },
  // TODO: (DSP-2087) Remove the below once tokens have launched
  '&::after': {
    height: token('space.050', '4px'),
    position: 'absolute',
    top: '100%',
    right: 0,
    left: 0,
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
    background: `linear-gradient(180deg, ${N40A} 0, ${N40A} 1px, ${N30A} 1px, ${hexToRGBA(
      // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
      N900,
      0,
    )} 4px)`,
    content: '""',
  },
});

const leftStyles = css({
  display: 'flex',
  minWidth: 0,
  height: 'inherit',
  alignItems: 'center',
  flexGrow: 1,
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '& > *': {
    flexShrink: 0,
  },
});

const rightStyles = css({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '& > *': {
    marginRight: token('space.050', '4px'),
    flexShrink: 0,
  },
});

const analyticsData = {
  attributes: { navigationLayer: 'global' },
  componentName: 'atlassianNavigation',
};

/**
 * __Atlassian navigation__
 *
 * The horizontal navigation component for Atlassian products.
 *
 * - [Examples](https://atlassian.design/components/atlassian-navigation/examples)
 * - [Code](https://atlassian.design/components/atlassian-navigation/examples)
 */
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
          style={theme.mode.navigation as React.CSSProperties}
          css={containerStyles}
          data-testid={testId && `${testId}-header`}
          role="banner"
        >
          <nav css={leftStyles} aria-label={label}>
            {AppSwitcher && <AppSwitcher />}
            {ProductHome && <ProductHome />}
            <PrimaryItemsContainer
              testId={testId}
              moreLabel={moreLabel}
              items={primaryItems}
              create={create}
              // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
              theme={theme}
            />
          </nav>

          <div
            css={rightStyles}
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
