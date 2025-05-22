import { createContext, useContext } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { SmartLinkStatus } from '../../constants';
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
export const FlexibleCardContext = createContext<FlexibleCardContextType | undefined>(undefined);
export const useFlexibleCardContext = () => useContext(FlexibleCardContext);

/**
 * This provides the data that will be used by Smart Links Flexible UI to populate it's
 * underlying elements.
 * @deprecated Remove on cleanup of platform-linking-flexible-card-context
 */
export const FlexibleUiContext = createContext<FlexibleUiDataContext | undefined>(undefined);

export const useFlexibleUiContext = () =>
	fg('platform-linking-flexible-card-context')
		? // eslint-disable-next-line react-hooks/rules-of-hooks
			useFlexibleCardContext()?.data
		: // eslint-disable-next-line react-hooks/rules-of-hooks
			useContext(FlexibleUiContext);

/**
 * This provides the ui options that will be used by Smart Links Flexible UI
 * to render its underlying elements.
 * @deprecated Remove on cleanup of platform-linking-flexible-card-context
 */
export const FlexibleUiOptionContext = createContext<InternalFlexibleUiOptions | undefined>(
	undefined,
);

export const useFlexibleUiOptionContext = () =>
	fg('platform-linking-flexible-card-context')
		? // eslint-disable-next-line react-hooks/rules-of-hooks
			useFlexibleCardContext()?.ui
		: // eslint-disable-next-line react-hooks/rules-of-hooks
			useContext(FlexibleUiOptionContext);
