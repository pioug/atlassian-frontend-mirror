import { useContext } from 'react';

import { HeadingLevelContext } from './heading-level-context';
import type { HeadingLevel } from './types';

/**
 * @internal
 * @returns The current heading level context.
 */
export const useHeadingLevel = (): HeadingLevel => {
	return useContext(HeadingLevelContext);
};
