import React from 'react';
import { SpinnerWrapper as EmotionSpinnerWrapper } from './styled-emotion';
import { SpinnerWrapper as CompiledSpinnerWrapper } from './styled-compiled';
import { fg } from '@atlaskit/platform-feature-flags';

export const SpinnerWrapper = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
) =>
	fg('platform_media_compiled') ? (
		<CompiledSpinnerWrapper {...props} />
	) : (
		<EmotionSpinnerWrapper {...props} />
	);
