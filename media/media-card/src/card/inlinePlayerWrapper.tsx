import React from 'react';
import { InlinePlayerWrapper as CompiledInlinePlayerWrapper } from './inlinePlayerWrapper-compiled';
import { type InlinePlayerWrapperProps } from './types';

export const InlinePlayerWrapper = (props: InlinePlayerWrapperProps) => (
	<CompiledInlinePlayerWrapper {...props} />
);
