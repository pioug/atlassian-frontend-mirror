import React from 'react';
import { fg } from '@atlaskit/platform-feature-flags';
import { type IconMessageWrapperProps } from './types';
import { IconMessageWrapper as CompiledIconMessageWrapper } from './iconMessageWrapper-compiled';
import { IconMessageWrapper as EmotionIconMessageWrapper } from './iconMessageWrapper-emotion';

export const IconMessageWrapper = (props: IconMessageWrapperProps) =>
	fg('platform_media_compiled') ? (
		<CompiledIconMessageWrapper {...props} />
	) : (
		<EmotionIconMessageWrapper {...props} />
	);
