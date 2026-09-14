import { createContext, type Context } from 'react';

import { type SmartLinkStatus } from '../../constants';
import { type InternalFlexibleUiOptions } from '../../view/FlexibleCard/types';
import { type FlexibleUiDataContext } from './types';

export type FlexibleCardContextType = {
	data?: FlexibleUiDataContext;
	status?: SmartLinkStatus;
	ui?: InternalFlexibleUiOptions;
};

/**
 * This provides the data that will be used by Smart Links Flexible UI to populate it's
 * underlying elements.
 */
export const FlexibleCardContext: Context<FlexibleCardContextType | undefined> = createContext<
	FlexibleCardContextType | undefined
>(undefined);
