/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

import React from 'react';

import { HoverCard as HoverCardComponent } from '../view/HoverCard';
import { type HoverCardProps } from '../view/HoverCard/types';

export const HoverCard = (props: HoverCardProps): React.JSX.Element => (
	<HoverCardComponent {...props} />
);

/**
 * @deprecated Use `import { HoverCard } from '@atlaskit/smart-card/hover'` instead.
 */
export const StandaloneHoverCard = (props: HoverCardProps): React.JSX.Element => (
	<HoverCardComponent {...props} />
);
