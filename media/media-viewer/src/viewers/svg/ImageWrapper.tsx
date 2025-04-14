import React, { type ReactNode, forwardRef } from 'react';
import { fg } from '@atlaskit/platform-feature-flags';
import { ImageWrapper as CompiledImageWrapper } from './ImageWrapper-compiled';
import { ImageWrapper as EmotionImageWrapper } from './ImageWrapper-emotion';

export type ImageWrapperProps = {
	children: ReactNode;
	isHidden: boolean;
	onClick: (e: React.MouseEvent<Element, MouseEvent>) => void;
};

export const ImageWrapper = forwardRef<HTMLDivElement, ImageWrapperProps>((props, ref) =>
	fg('platform_media_compiled') ? (
		<CompiledImageWrapper {...props} ref={ref} />
	) : (
		<EmotionImageWrapper {...props} ref={ref} />
	),
);
