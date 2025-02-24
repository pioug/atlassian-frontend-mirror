import React from 'react';
import { InlinePlayerWrapper as CompiledInlinePlayerWrapper } from './inlinePlayerWrapper-compiled';
import { InlinePlayerWrapper as EmotionInlinePlayerWrapper } from './inlinePlayerWrapper-emotion';
import { type InlinePlayerWrapperProps } from './types';
import { fg } from '@atlaskit/platform-feature-flags';

export const InlinePlayerWrapper = (props: InlinePlayerWrapperProps) => {
	return fg('platform_media_compiled') ? (
		<CompiledInlinePlayerWrapper {...props} />
	) : (
		<EmotionInlinePlayerWrapper {...props} />
	);
};
