/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { type ReactNode, forwardRef } from 'react';

const imageWrapperStyles = css({
	width: '100vw',
	height: '100vh',
	overflow: 'auto',
	textAlign: 'center',
	verticalAlign: 'middle',
	whiteSpace: 'nowrap',
});

const dynamicImageWrapperStyles = css({
	overflow: 'hidden',
});

export type ImageWrapperProps = {
	children: ReactNode;
	isHidden: boolean;
	onClick: (e: React.MouseEvent<Element, MouseEvent>) => void;
};

export const ImageWrapper = forwardRef<HTMLDivElement, ImageWrapperProps>(
	({ children, onClick, isHidden }: ImageWrapperProps, ref) => (
		<div
			data-testid="media-viewer-svg-wrapper"
			onClick={onClick}
			ref={ref}
			css={[imageWrapperStyles, isHidden && dynamicImageWrapperStyles]}
		>
			{children}
		</div>
	),
);
