/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, css } from '@compiled/react';
import React from 'react';

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

export const NativePdfViewer = ({ src, children, onSuccess, onError }: Props) => {
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

	return (
		<div css={pdfWrapperStyles} data-testid="native-pdf-viewer">
			<div css={headerStyles} />
			<object data={src} type="application/pdf" css={pdfWrapperStyles}>
				<div ref={ref}>{children}</div>
			</object>
		</div>
	);
};
