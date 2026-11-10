/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

import { jsx, css } from '@compiled/react';

import { useIsInsetViewer } from '../../insetViewerContext';
import { InsetMediaFrame } from '../../styleWrappers';

type Props = {
	src: string;
	children: React.ReactNode;
	onSuccess: () => void;
	onError: () => void;
};

const pdfWrapperStyles = css({
	height: '100%',
	width: '100%',
});

const headerStyles = css({
	height: '75px',
	width: '100%',
});

const PDF_MIME_TYPE = 'application/pdf';

// This viewer is the browser's own PDF viewer in an <object>. It can only show PDFs, and only in
// browsers that have a PDF viewer; for anything else the browser downloads the file and leaves the
// <object> empty, with no event to tell. Check this before rendering it.
export const canRenderInNativePdfViewer = (mimeType: string): boolean =>
	mimeType === PDF_MIME_TYPE &&
	(typeof navigator === 'undefined' || navigator.pdfViewerEnabled !== false);

export const NativePdfViewer = ({ src, children, onSuccess, onError }: Props): JSX.Element => {
	const isInsetViewer = useIsInsetViewer();
	const ref = (element: HTMLDivElement | null) => {
		if (!element) {
			return;
		}

		// The only way to know if an object is loaded is to check the bounding client rect of the error element
		const rect = element.getBoundingClientRect();
		if (rect.width === 0 && rect.height === 0) {
			onSuccess();
		} else {
			onError();
		}
	};

	// The same side gutter and corners as the other media in the inset viewer.
	const ConditionalInsetMediaFrame = isInsetViewer ? InsetMediaFrame : React.Fragment;

	return (
		<ConditionalInsetMediaFrame>
			<div css={pdfWrapperStyles} data-testid="native-pdf-viewer">
				{/* The inset viewer has its own header row, so there is nothing to clear. */}
				{!isInsetViewer && <div css={headerStyles} />}
				<object data={src} type="application/pdf" css={pdfWrapperStyles}>
					<div ref={ref}>{children}</div>
				</object>
			</div>
		</ConditionalInsetMediaFrame>
	);
};
