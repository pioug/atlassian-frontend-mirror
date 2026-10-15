import { createContext } from 'react';

import type { Get } from './types';

/**
 * __Is fhs enabled context__
 *
 * @deprecated Full height sidebar (FHS) has been rolled back and this context is no longer read by
 * any platform component. Its value is ignored. Remove usages of it; it will be deleted in a future
 * major release.
 *
 * See https://hello.atlassian.net/wiki/spaces/navx/pages/7189669176/Full+Height+Sidebar+FHS+Rollback+Plan
 */
export const IsFhsEnabledContext: import('react').Context<boolean | Get<boolean>> = createContext<
	boolean | Get<boolean>
>(false);
