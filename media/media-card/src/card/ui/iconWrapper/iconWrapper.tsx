import React from 'react';
import { fg } from '@atlaskit/platform-feature-flags';
import { IconWrapper as CompiledIconWrapper } from './iconWrapper-compiled';
import { IconWrapper as EmotionIconWrapper } from './iconWrapper-emotion';

import { type IconWrapperProps } from './types';

export const IconWrapper = (props: IconWrapperProps) =>
	fg('platform_media_compiled') ? (
		<CompiledIconWrapper {...props} />
	) : (
		<EmotionIconWrapper {...props} />
	);
