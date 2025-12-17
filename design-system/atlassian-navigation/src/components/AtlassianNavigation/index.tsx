/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import { N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { HORIZONTAL_GLOBAL_NAV_HEIGHT } from '../../common/constants';
import { defaultTheme, ThemeProvider } from '../../theme';
import { PrimaryItemsContainer } from '../PrimaryItemsContainer';

import { type AtlassianNavigationProps } from './types';

const containerStyles = css({
	display: 'flex',
	boxSizing: 'border-box',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	height: HORIZONTAL_GLOBAL_NAV_HEIGHT,
	position: 'relative',
	alignItems: 'center',
	justifyContent: 'space-between',
	flexShrink: 0,
	borderBlockEnd: `${token('border.width')} solid ${token('color.border', N30)}`,
	paddingInlineEnd: token('space.150', '12px'),
	paddingInlineStart: token('space.150', '12px'),
});

const leftStyles = css({
	display: 'flex',
	minWidth: 0,
	height: 'inherit',
	alignItems: 'center',
	flexGrow: 1,
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > *': {
		flexShrink: 0,
	},
});

const rightStyles = css({
	display: 'flex',
	alignItems: 'center',
	flexShrink: 0,
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
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
export const AtlassianNavigation = (props: AtlassianNavigationProps): React.JSX.Element => {
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
		isServer = false,
		isSSRPlaceholderEnabled = false,
	} = props;

	return (
		<ThemeProvider value={theme}>
			<NavigationAnalyticsContext data={analyticsData}>
				<header
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={theme.mode.navigation as React.CSSProperties}
					css={containerStyles}
					data-testid={testId && `${testId}-header`}
					role="banner"
					data-vc={`atlassian-navigation${isServer ? '-ssr' : ''}`}
					{...(isServer &&
						isSSRPlaceholderEnabled && {
							'data-ssr-placeholder': 'atlassian-navigation-placeholder',
						})}
					{...(!isServer &&
						isSSRPlaceholderEnabled && {
							'data-ssr-placeholder-replace': 'atlassian-navigation-placeholder',
						})}
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

					<div css={rightStyles} data-testid={testId && `${testId}-secondary-actions`}>
						{Search && <Search />}
						<div
							role="list"
							css={[rightStyles, noRightMarginStyles]}
							data-vc="atlassian-navigation-secondary-actions"
						>
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
