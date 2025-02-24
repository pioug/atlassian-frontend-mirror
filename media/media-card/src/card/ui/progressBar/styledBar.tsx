import React from 'react';
import { type StyledBarProps } from './types';
import { fg } from '@atlaskit/platform-feature-flags';
import { StyledBar as CompiledStyledBar } from './styledBar-compiled';
import { StyledBar as EmotionStyledBar } from './styledBar-emotion';

export const StyledBar = (props: StyledBarProps) =>
	fg('platform_media_compiled') ? (
		<CompiledStyledBar {...props} />
	) : (
		<EmotionStyledBar {...props} />
	);
