/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { HORIZONTAL_GLOBAL_NAV_HEIGHT } from '../../common/constants';
import { defaultTheme, ThemeProvider } from '../../theme';
import { PrimaryItemsContainer } from '../PrimaryItemsContainer';
import { PrimaryItemsContainer as PrimaryItemsContainerV2 } from '../PrimaryItemsContainerV2';

import { type AtlassianNavigationProps } from './types';

const containerStyles = css({
  display: 'flex',
  boxSizing: 'border-box',
  height: HORIZONTAL_GLOBAL_NAV_HEIGHT,
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderBlockEnd: `1px solid ${token('color.border', N30)}`,
  paddingInlineEnd: token('space.150', '12px'),
  paddingInlineStart: token('space.150', '12px'),
});

const leftStyles = css({
  display: 'flex',
  minWidth: 0,
  height: 'inherit',
  alignItems: 'center',
  flexGrow: 1,
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  '& > *': {
    flexShrink: 0,
  },
});

const rightStyles = css({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  '& > *': {
    flexShrink: 0,
    marginInlineEnd: token('space.050', '4px'),
  },
});

const noRightMarginStyles = css({
  marginInlineEnd: 0,
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
            {getBooleanFF(
              'platform.design-system-team.navigation-v2-no-jank_5yhbd',
            ) ? (
              <PrimaryItemsContainerV2
                testId={testId}
                moreLabel={moreLabel}
                items={primaryItems}
                create={create}
                // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
                theme={theme}
              />
            ) : (
              <PrimaryItemsContainer
                testId={testId}
                moreLabel={moreLabel}
                items={primaryItems}
                create={create}
                // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
                theme={theme}
              />
            )}
          </nav>

          <div
            css={rightStyles}
            data-testid={testId && `${testId}-secondary-actions`}
          >
            {Search && <Search />}
            <div role="list" css={[rightStyles, noRightMarginStyles]}>
              {Notifications && <Notifications />}
              {Help && <Help />}
              {Settings && <Settings />}
              {SignIn && <SignIn />}
              {Profile && <Profile />}
            </div>
          </div>
        </header>
      </NavigationAnalyticsContext>
    </ThemeProvider>
  );
};

export default AtlassianNavigation;
