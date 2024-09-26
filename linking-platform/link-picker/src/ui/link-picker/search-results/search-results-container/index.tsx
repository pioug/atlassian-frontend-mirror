/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useLayoutEffect, useRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { MinHeightContainer } from '../../../../common/ui/min-height-container';

const flexColumn = css({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'flex-start',
	width: '100%',
});

type SearchResultsContainerProps = {
	adaptiveHeight: boolean;
	isLoadingResults: boolean;
	hasTabs?: boolean;
	children?: React.ReactNode;
};

export const SearchResultsContainer = ({
	hasTabs,
	adaptiveHeight,
	isLoadingResults,
	children,
}: SearchResultsContainerProps) => {
	const ref = useRef<HTMLDivElement>(null);
	const currentHeight: React.MutableRefObject<number | null> = useRef<number>(null);

	const fixedMinHeight = hasTabs ? '347px' : '302px';
	const adaptiveMinHeight =
		isLoadingResults && !!currentHeight.current ? `${currentHeight.current}px` : 'auto';
	const minheight = adaptiveHeight ? adaptiveMinHeight : fixedMinHeight;

	useLayoutEffect(() => {
		if (ref.current && adaptiveHeight && !isLoadingResults) {
			currentHeight.current = ref.current.getBoundingClientRect().height;
		}
	});

	return (
		<MinHeightContainer ref={ref} minHeight={minheight} css={flexColumn}>
			{children}
		</MinHeightContainer>
	);
};
