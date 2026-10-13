import React, { type ReactNode } from 'react';

import { fg } from '@atlaskit/platform-feature-flags/fg';

import { defaultExitingContext, ExitingContext } from './exiting-persistence';

/**
 * Separates a container's presence from its content. Place inside the component
 * that owns the container animation, so descendants cannot complete its exit.
 * Restores standalone presence rather than disabling motion: explicit animations
 * and nested ExitingPersistence boundaries retain their own lifecycle.
 */
export default function MotionPresenceBoundary({ children }: { children: ReactNode }): JSX.Element {
	return fg('platform-dst-motion-isolate-presence') ? (
		<ExitingContext.Provider value={defaultExitingContext}>{children}</ExitingContext.Provider>
	) : (
		<>{children}</>
	);
}
