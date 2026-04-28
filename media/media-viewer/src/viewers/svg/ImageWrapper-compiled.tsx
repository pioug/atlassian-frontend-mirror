/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import React, { type ReactNode, forwardRef } from 'react';
import { fg } from '@atlaskit/platform-feature-flags';

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

export const ImageWrapper: React.ForwardRefExoticComponent<
	ImageWrapperProps & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, ImageWrapperProps>(
	({ children, onClick, isHidden }: ImageWrapperProps, ref) => {
		const a11yProps = fg('platform_media_a11y_suppression_fixes') ? { role: 'none' as const } : {};

		return (
			// eslint-disable-next-line @atlassian/a11y/click-events-have-key-events, @atlassian/a11y/interactive-element-not-keyboard-focusable, @atlassian/a11y/no-static-element-interactions
			<div
				{...a11yProps}
				data-testid="media-viewer-svg-wrapper"
				onClick={onClick}
				ref={ref}
				css={[imageWrapperStyles, isHidden && dynamicImageWrapperStyles]}
			>
				{children}
			</div>
		);
	},
);
