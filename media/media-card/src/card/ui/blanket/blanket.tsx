import React from 'react';
import { fg } from '@atlaskit/platform-feature-flags';
import { Blanket as CompiledBlanket } from './blanket-compiled';
import { Blanket as EmotionBlanket } from './blanket-emotion';

export interface BlanketProps {
	isFixed?: boolean;
}

export const Blanket = (props: BlanketProps) =>
	fg('platform_media_compiled') ? <CompiledBlanket {...props} /> : <EmotionBlanket {...props} />;
