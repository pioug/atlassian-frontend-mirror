/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css } from '@compiled/react';

import { jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { Page } from './page';
import { type PageRangeContent } from './types';
import { usePageContent } from './usePageContent';
import { useCachedGetImage } from './utils/useCachedGetImage';

type DocumentViewerProps = {
	getContent: (pageStart: number, pageEnd: number) => Promise<PageRangeContent>;
	getPageImageUrl: (pageNumber: number, zoom: number) => Promise<string>;
	paginationSize?: number;
	zoom: number;
	onSuccess?: () => void;
};

const documentViewerStyles = css({
	marginTop: token('space.800', '64px'),
	minWidth: '100%',
	display: 'flex',
	gap: token('space.150'),
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	overflow: 'auto',
});

const DEFAULT_PAGINATION_SIZE = 50;

export const DocumentViewer = ({
	onSuccess,
	getContent,
	getPageImageUrl,
	paginationSize = DEFAULT_PAGINATION_SIZE,
	zoom,
}: DocumentViewerProps) => {
	const { getPageContent, loadPageContent, documentMetadata } = usePageContent(
		getContent,
		paginationSize,
	);
	const getImageUrl = useCachedGetImage(getPageImageUrl);

	const style: Record<string, number> = {
		'--document-viewer-zoom': zoom,
	};

	return (
		<div data-testid="document-viewer" style={style} css={documentViewerStyles}>
			{[...Array(documentMetadata.pageCount ?? 4)].map((_, i) => {
				const { page, fonts } = getPageContent(i);
				return (
					<Page
						key={i}
						getPageSrc={getImageUrl}
						pageIndex={i}
						zoom={zoom}
						defaultDimensions={documentMetadata.defaultDimensions}
						onVisible={() => loadPageContent(i)}
						onLoad={i === 0 ? onSuccess : undefined}
						fonts={fonts}
						content={page}
					/>
				);
			})}
		</div>
	);
};
