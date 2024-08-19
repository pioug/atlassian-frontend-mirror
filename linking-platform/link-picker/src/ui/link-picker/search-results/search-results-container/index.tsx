/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { fg } from '@atlaskit/platform-feature-flags';

import { MinHeightContainer } from '../../../../common/ui/min-height-container';

const flexColumn = css({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'flex-start',
	width: '100%',
});

type SearchResultsContainerProps = React.HTMLAttributes<HTMLDivElement> & {
	hasTabs?: boolean;
	children?: React.ReactNode;
};

export const SearchResultsContainer = forwardRef<HTMLDivElement, SearchResultsContainerProps>(
	({ hasTabs, ...props }: SearchResultsContainerProps, ref) => {
		const minHeight = hasTabs ? '347px' : '302px';
		const ffMinHeight = fg('platform.linking-platform.link-picker.fixed-height-search-results')
			? minHeight
			: 'auto';

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		return <MinHeightContainer ref={ref} minHeight={ffMinHeight} css={flexColumn} {...props} />;
	},
);
