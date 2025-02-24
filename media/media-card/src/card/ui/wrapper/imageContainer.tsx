import React from 'react';
import { fg } from '@atlaskit/platform-feature-flags';
import { ImageContainer as CompiledImageContainer } from './imageContainer-compiled';
import { ImageContainer as EmotionImageContainer } from './imageContainer-compiled';

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

export const ImageContainer = (props: ImageContainerProps) =>
	fg('platform_media_compiled') ? (
		<CompiledImageContainer {...props} />
	) : (
		<EmotionImageContainer {...props} />
	);
