/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
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
		// eslint-disable-next-line @atlassian/a11y/click-events-have-key-events, @atlassian/a11y/interactive-element-not-keyboard-focusable, @atlassian/a11y/no-static-element-interactions
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
