import React, { forwardRef } from 'react';
import { InactivityDetectorWrapper as EmotionInactivityDetectorWrapper } from './styled-emotion';
import {
	InactivityDetectorWrapper as CompiledInactivityDetectorWrapper,
	type ContentWrapperProps,
} from './styled-compiled';
import { fg } from '@atlaskit/platform-feature-flags';

export const InactivityDetectorWrapper = forwardRef(
	(
		props: ContentWrapperProps &
			React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> &
			React.ClassAttributes<HTMLDivElement>,
		ref,
	) =>
		fg('platform_media_compiled') ? (
			<CompiledInactivityDetectorWrapper {...props} ref={ref as React.RefObject<HTMLDivElement>} />
		) : (
			<EmotionInactivityDetectorWrapper {...props} ref={ref as React.RefObject<HTMLDivElement>} />
		),
);

export type { ContentWrapperProps } from './styled-compiled';
