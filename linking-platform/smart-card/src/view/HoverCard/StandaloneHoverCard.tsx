import React from 'react';

import { HoverCard } from './HoverCard';
import { type HoverCardProps } from './types';

/**
 * A standalone hover preview component
 */
export const StandaloneHoverCard = (props: HoverCardProps): React.JSX.Element => (
	<HoverCard {...props} />
);
