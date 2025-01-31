/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { HORIZONTAL_GLOBAL_NAV_HEIGHT } from '../../common/constants';
import { defaultTheme, ThemeProvider } from '../../theme';
import { IconButtonSkeleton } from '../IconButton/skeleton';
import { PrimaryItemsContainerSkeleton } from '../PrimaryItemsContainer/skeleton';
import { ProductHomeSkeleton } from '../ProductHome/skeleton';
import { ProfileSkeleton } from '../Profile/skeleton';
import { SearchSkeleton } from '../Search/skeleton';

import { type NavigationSkeletonProps } from './types';

const containerStyles = css({
	display: 'flex',
	boxSizing: 'border-box',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
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

/**
 * __Navigation skeleton__
 *
 * Use loading skeletons to reduce the perceived loading time of heavier
 * full-page experiences. This should only be used when the whole navigation is
 * delayed; if there are only certain dynamically loaded navigation items that
 * slow down the page, you should look into using
 * [skeleton buttons](https://atlassian.design/components/atlassian-navigation/examples#skeleton-button)
 * instead.
 *
 * - [Examples](https://atlassian.design/components/atlassian-navigation/examples#skeleton-loader)
 * - [Code](https://atlassian.design/components/{packageName}/code)
 */
export const NavigationSkeleton = ({
	primaryItemsCount = 4,
	secondaryItemsCount = 4,
	theme = defaultTheme,
	showSiteName = false,
	shouldShowSearch = true,
	testId,
}: NavigationSkeletonProps) => {
	return (
		<ThemeProvider value={theme}>
			<div
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={theme.mode.navigation as React.CSSProperties}
				css={containerStyles}
				data-testid={testId}
			>
				<div css={leftStyles}>
					<IconButtonSkeleton marginLeft={0} marginRight={5} size={26} />
					<ProductHomeSkeleton showSiteName={showSiteName} />
					<PrimaryItemsContainerSkeleton count={primaryItemsCount} />
				</div>
				<div css={rightStyles}>
					{shouldShowSearch && <SearchSkeleton />}
					{Array.from({ length: secondaryItemsCount }, (_, index) => (
						<IconButtonSkeleton key={index} marginLeft={0} marginRight={4} size={26} />
					))}
					<ProfileSkeleton />
				</div>
			</div>
		</ThemeProvider>
	);
};
