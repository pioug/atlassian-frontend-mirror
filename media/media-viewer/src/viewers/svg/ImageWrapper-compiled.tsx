/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { type ReactNode, forwardRef } from 'react';

import { css, jsx } from '@compiled/react';

import { useIsInsetViewer } from '../../insetViewerContext';

const imageWrapperStyles = css({
	width: '100vw',
	height: '100vh',
	overflow: 'auto',
	textAlign: 'center',
	verticalAlign: 'middle',
	whiteSpace: 'nowrap',
});

const insetViewerImageWrapperStyles = css({
	width: '100%',
	height: '100%',
	maxWidth: '100%',
	maxHeight: '100%',
});

const dynamicImageWrapperStyles = css({
	overflow: 'hidden',
});

export type ImageWrapperProps = {
	children: ReactNode;
	isHidden: boolean;
	onClick: (e: React.MouseEvent<Element, MouseEvent>) => void;
};

export const ImageWrapper: React.ForwardRefExoticComponent<
	ImageWrapperProps & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, ImageWrapperProps>(
	({ children, onClick, isHidden }: ImageWrapperProps, ref) => {
		const isInsetViewer = useIsInsetViewer();
		return (
			<div
				role="none"
				data-testid="media-viewer-svg-wrapper"
				onClick={onClick}
				ref={ref}
				css={[
					imageWrapperStyles,
					isInsetViewer && insetViewerImageWrapperStyles,
					isHidden && dynamicImageWrapperStyles,
				]}
			>
				{children}
			</div>
		);
	},
);
