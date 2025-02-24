import React, { forwardRef } from 'react';
import { type CardActionButtonOwnProps } from './styles';
import { fg } from '@atlaskit/platform-feature-flags';
import { CardActionButton as CompiledCardActionButton } from './cardActionButton-compiled';
import { CardActionButton as EmotionCardActionButton } from './cardActionButton-compiled';

export const CardActionButton = forwardRef<HTMLButtonElement, CardActionButtonOwnProps>(
	(props, ref) =>
		fg('platform_media_compiled') ? (
			<CompiledCardActionButton {...props} ref={ref} />
		) : (
			<EmotionCardActionButton {...props} ref={ref} />
		),
);
