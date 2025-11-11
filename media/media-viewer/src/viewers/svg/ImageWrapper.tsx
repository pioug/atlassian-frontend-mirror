import React, { type ReactNode, forwardRef } from 'react';
import { ImageWrapper as CompiledImageWrapper } from './ImageWrapper-compiled';

export type ImageWrapperProps = {
	children: ReactNode;
	isHidden: boolean;
	onClick: (e: React.MouseEvent<Element, MouseEvent>) => void;
};

export const ImageWrapper = forwardRef<HTMLDivElement, ImageWrapperProps>((props, ref) => (
	<CompiledImageWrapper {...props} ref={ref} />
));
