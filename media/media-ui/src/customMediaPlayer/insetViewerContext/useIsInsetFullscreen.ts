import { useContext } from 'react';

import { InsetFullscreenContext } from './insetFullscreenContext';

export const useIsInsetFullscreen = (): boolean => useContext(InsetFullscreenContext);
