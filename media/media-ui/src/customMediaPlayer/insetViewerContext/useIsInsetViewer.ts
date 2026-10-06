import { useContext } from 'react';

import { InsetViewerContext } from './insetViewerContext';

export const useIsInsetViewer = (): boolean => useContext(InsetViewerContext);
