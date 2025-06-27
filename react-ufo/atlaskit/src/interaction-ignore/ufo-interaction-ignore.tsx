import React from 'react';

import UFOIgnoreHolds, { type UFOIgnoreHoldsProps } from '../ignore-holds';

/**
 * Legacy wrapper component that delegates to `UFOIgnoreHolds`.
 * Use `UFOIgnoreHolds` instead for new implementations.
 * This component is maintained for backward compatibility only.
 */
export default function UFOInteractionIgnore(props: UFOIgnoreHoldsProps) {
	return <UFOIgnoreHolds {...props} />;
}
