import React from 'react';
import { Icon as EmotionIcon } from './Icon-emotion';
import { Icon as CompiledIcon } from './Icon-compiled';
import { AKIconWrapper as EmotionAKIconWrapper } from './Icon-emotion';
import { AKIconWrapper as CompiledAKIconWrapper } from './Icon-compiled';
import { fg } from '@atlaskit/platform-feature-flags';

export const Icon = (
	props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
) => (fg('platform_media_compiled') ? <CompiledIcon {...props} /> : <EmotionIcon {...props} />);

export const AKIconWrapper = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
) =>
	fg('platform_media_compiled') ? (
		<CompiledAKIconWrapper {...props} />
	) : (
		<EmotionAKIconWrapper {...props} />
	);
