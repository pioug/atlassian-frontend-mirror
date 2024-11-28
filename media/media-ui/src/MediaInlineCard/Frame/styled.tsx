import React from 'react';
import { Wrapper as EmotionWrapper } from './styled-emotion';
import { Wrapper as CompiledWrapper, type WrapperProps } from './styled-compiled';
import { fg } from '@atlaskit/platform-feature-flags';

export const Wrapper = (
	props: WrapperProps &
		React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
) =>
	fg('platform_media_compiled') ? <CompiledWrapper {...props} /> : <EmotionWrapper {...props} />;

export type { WrapperProps } from './styled-compiled';
