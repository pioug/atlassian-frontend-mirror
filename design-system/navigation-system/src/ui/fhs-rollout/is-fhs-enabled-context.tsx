import { createContext } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import type { Get } from './types';

/**
 * __Is fhs enabled context__
 *
 * Tracks is FHS enabled.
 * Defaults to feature gate 'navx-full-height-sidebar'.
 */
export const IsFhsEnabledContext: import('react').Context<boolean | Get<boolean>> = createContext<
	boolean | Get<boolean>
>(() => fg('navx-full-height-sidebar'));
