import React from 'react';
import { type UnhandledErrorCardProps } from './types';
import { UnhandledErrorCard as CompiledUnhanldedErrorCard } from './unhandledErrorCard-compiled';

export const UnhandledErrorCard = (props: UnhandledErrorCardProps) => (
	<CompiledUnhanldedErrorCard {...props} />
);
