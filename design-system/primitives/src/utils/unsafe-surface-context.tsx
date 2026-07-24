import type { Context } from 'react';

import { SurfaceContext } from './surface-context';
import type { BackgroundColorToken } from './types';

export const UNSAFE_SurfaceContext: Context<BackgroundColorToken> = SurfaceContext;
