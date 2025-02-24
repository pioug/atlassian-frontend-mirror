import React from 'react';
import { fg } from '@atlaskit/platform-feature-flags';
import { type TickBoxProps } from './types';
import { TickBoxWrapper as CompiledTickBoxWrapper } from './tickBoxWrapper-compiled';
import { TickBoxWrapper as EmotionTickBoxWrapper } from './tickBoxWrapper-emotion';

export const TickBoxWrapper = (props: TickBoxProps) =>
	fg('platform_media_compiled') ? (
		<CompiledTickBoxWrapper {...props} />
	) : (
		<EmotionTickBoxWrapper {...props} />
	);

TickBoxWrapper.displayName = 'TickBoxWrapper';
