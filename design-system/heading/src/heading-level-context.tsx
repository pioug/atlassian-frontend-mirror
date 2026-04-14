import React, { createContext } from 'react';

import type { HeadingLevel } from './types';

/**
 * A context for the heading level.
 */
export const HeadingLevelContext: React.Context<HeadingLevel> = createContext<HeadingLevel>(0);
