/** @jsx jsx */
import { forwardRef } from 'react';

import { jsx } from '@emotion/react';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { MinHeightContainer } from '../../../../common/ui/min-height-container';

import { flexColumn } from './styled';

type SearchResultsContainerProps = React.HTMLAttributes<HTMLDivElement> & {
	hasTabs?: boolean;
	children?: React.ReactNode;
};

export const SearchResultsContainer = forwardRef<HTMLDivElement, SearchResultsContainerProps>(
	({ hasTabs, ...props }: SearchResultsContainerProps, ref) => {
		const minHeight = hasTabs ? '347px' : '302px';
		const ffMinHeight = getBooleanFF(
			'platform.linking-platform.link-picker.fixed-height-search-results',
		)
			? minHeight
			: 'auto';

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		return <MinHeightContainer ref={ref} minHeight={ffMinHeight} css={flexColumn} {...props} />;
	},
);
