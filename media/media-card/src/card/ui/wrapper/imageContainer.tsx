import React from 'react';
import { ImageContainer as CompiledImageContainer } from './imageContainer-compiled';
import type { MediaCardCursor } from '../../../types';

type ImageContainerProps = {
	children: React.ReactNode;
	centerElements?: boolean;
	testId: string;
	mediaCardCursor?: MediaCardCursor;
	mediaName?: string;
	status?: string;
	progress?: number;
	selected?: boolean;
	source?: string;
};

export const ImageContainer = (props: ImageContainerProps): React.JSX.Element => (
	<CompiledImageContainer {...props} />
);
