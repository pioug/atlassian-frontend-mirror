import React from 'react';
import { Wrapper as EmotionWrapper } from './styled-emotion';
import { Wrapper as CompiledWrapper, type WrapperProps } from './styled-compiled';
import { fg } from '@atlaskit/platform-feature-flags';

export const Wrapper = React.forwardRef(
	(
		props: WrapperProps &
			React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
		ref: React.Ref<HTMLSpanElement>,
	) =>
		fg('platform_media_compiled') ? (
			<CompiledWrapper {...props} ref={ref} />
		) : (
			<EmotionWrapper {...props} ref={ref} />
		),
);

export type { WrapperProps } from './styled-compiled';
