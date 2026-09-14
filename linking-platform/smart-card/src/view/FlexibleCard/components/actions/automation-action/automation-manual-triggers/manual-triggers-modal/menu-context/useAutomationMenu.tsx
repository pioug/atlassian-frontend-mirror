// This is another layer on top of the AFE ManualRulesContainer.
// It is necessary that this container wraps the entire "automation" component and not nested. Else the user input form will not render correctly.
// This container provides an automation context to all children components through the useAutomationMenu hook.

import { useContext } from 'react';

import { AutomationMenuContext } from './AutomationMenuContext';
import type { MenuContext } from './main';

// Hook that can be used anywhere under the AutomationMenuContextContainer to access the AutomationMenuContext values
export const useAutomationMenu = (): MenuContext => {
	const context = useContext(AutomationMenuContext);
	if (context === undefined) {
		throw new Error('useAutomationMenu must be used within a AutomationMenuProvider');
	}
	return context;
};
