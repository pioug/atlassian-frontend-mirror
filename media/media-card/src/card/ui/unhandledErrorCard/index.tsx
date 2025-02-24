import React from 'react';
import { type UnhandledErrorCardProps } from './types';
import { fg } from '@atlaskit/platform-feature-flags';
import { UnhandledErrorCard as CompiledUnhanldedErrorCard } from './unhandledErrorCard-compiled';
import { UnhandledErrorCard as EmotionUnhanldedErrorCard } from './unhandledErrorCard-emotion';

export const UnhandledErrorCard = (props: UnhandledErrorCardProps) =>
	fg('platform_media_compiled') ? (
		<CompiledUnhanldedErrorCard {...props} />
	) : (
		<EmotionUnhanldedErrorCard {...props} />
	);
