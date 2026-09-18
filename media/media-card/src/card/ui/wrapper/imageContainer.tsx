import React from 'react';

import type { MediaCardCursor } from '../../../types';
import { ImageContainer as CompiledImageContainer } from './imageContainer-compiled';

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
	mediaMotion?: 'hidden' | 'entering';
};

export const ImageContainer = (props: ImageContainerProps): React.JSX.Element => (
	<CompiledImageContainer {...props} />
);
