/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { CREATE_BREAKPOINT } from '../../common/constants';
import { useTheme } from '../../theme';
import { IconButtonSkeleton } from '../IconButton/skeleton';

const searchInputContainerStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-physical-properties
	marginRight: token('space.100', '8px'),
	// eslint-disable-next-line @atlaskit/design-system/no-physical-properties
	marginLeft: token('space.250', '20px'),
	position: 'relative',
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`@media (max-width: ${CREATE_BREAKPOINT - 1}px)`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		display: 'none !important',
	},
});

const searchInputSkeletonStyles = css({
	boxSizing: 'border-box',
	width: '220px',
	height: token('space.400', '32px'),
	padding: `0 ${token('space.100', '8px')} 0 ${token('space.500', '40px')}`,
	borderRadius: token('radius.large', '6px'),
	opacity: 0.15,
});

const searchIconStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`@media (min-width: ${CREATE_BREAKPOINT}px)`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		display: 'none !important',
	},
});

// Not exported to consumers, only used in NavigationSkeleton
// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const SearchSkeleton = () => {
	const theme = useTheme();

	return (
		<Fragment>
			<div css={searchInputContainerStyles}>
				<div
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={theme.mode.skeleton as React.CSSProperties}
					css={searchInputSkeletonStyles}
				/>
			</div>
			<IconButtonSkeleton css={searchIconStyles} marginRight={5} size={26} />
		</Fragment>
	);
};
