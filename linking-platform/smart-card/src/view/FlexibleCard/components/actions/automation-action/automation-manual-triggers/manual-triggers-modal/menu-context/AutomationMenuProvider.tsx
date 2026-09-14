// This is another layer on top of the AFE ManualRulesContainer.
import React from 'react';

// It is necessary that this container wraps the entire "automation" component and not nested. Else the user input form will not render correctly.
// This container provides an automation context to all children components through the useAutomationMenu hook.

import { AutomationMenuContext } from './AutomationMenuContext';
import type { AutomationProviderProps } from './AutomationProviderProps';

export const AutomationMenuProvider: any = ({ children, value }: AutomationProviderProps) => {
	return <AutomationMenuContext.Provider value={value}>{children}</AutomationMenuContext.Provider>;
};
