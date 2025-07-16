/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useLayoutEffect, useRef } from 'react';

import { css, jsx } from '@compiled/react';

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
}: SearchResultsContainerProps): JSX.Element => {
	const ref = useRef<HTMLDivElement>(null);
	const currentHeight: React.MutableRefObject<number | null> = useRef<number>(null);

	const fixedMinHeight = hasTabs ? '296px' : '251px';
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
