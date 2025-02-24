import React from 'react';
import { fg } from '@atlaskit/platform-feature-flags';
import { type WrapperProps } from './types';
import { Wrapper as CompiledWrapper } from './wrapper-compiled';
import { Wrapper as EmotionWrapper } from './wrapper-emotion';

export const Wrapper = (props: WrapperProps) =>
	fg('platform_media_compiled') ? <CompiledWrapper {...props} /> : <EmotionWrapper {...props} />;
