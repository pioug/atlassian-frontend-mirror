import { createContext, useContext } from 'react';

import { type InternalFlexibleUiOptions } from '../../view/FlexibleCard/types';

import { type FlexibleUiDataContext } from './types';

/**
 * This provides the data that will be used by Smart Links Flexible UI to populate it's
 * underlying elements.
 */
export const FlexibleUiContext = createContext<FlexibleUiDataContext | undefined>(undefined);

export const useFlexibleUiContext = () => useContext(FlexibleUiContext);

/**
 * This provides the ui options that will be used by Smart Links Flexible UI
 * to render its underlying elements.
 */
export const FlexibleUiOptionContext = createContext<InternalFlexibleUiOptions | undefined>(
	undefined,
);

export const useFlexibleUiOptionContext = () => useContext(FlexibleUiOptionContext);
