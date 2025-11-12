import React from 'react';
import { ImageContainer as CompiledImageContainer } from './imageContainer-compiled';

type ImageContainerProps = {
	children: React.ReactNode;
	centerElements?: boolean;
	testId: string;

	mediaName?: string;
	status?: string;
	progress?: number;
	selected?: boolean;
	source?: string;
};

export const ImageContainer = (props: ImageContainerProps) => <CompiledImageContainer {...props} />;
