// This is another layer on top of the AFE ManualRulesContainer.
// It is necessary that this container wraps the entire "automation" component and not nested. Else the user input form will not render correctly.
// This container provides an automation context to all children components through the useAutomationMenu hook.

import React, { createContext } from 'react';

import type { MenuContext } from './main';

export const AutomationMenuContext: React.Context<MenuContext | undefined> = createContext<
	MenuContext | undefined
>(undefined);
