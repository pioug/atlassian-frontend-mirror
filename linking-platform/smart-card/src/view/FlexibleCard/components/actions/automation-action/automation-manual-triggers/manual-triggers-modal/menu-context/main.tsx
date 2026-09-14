// This is another layer on top of the AFE ManualRulesContainer.
// It is necessary that this container wraps the entire "automation" component and not nested. Else the user input form will not render correctly.
// This container provides an automation context to all children components through the useAutomationMenu hook.

import React from 'react';

import type { ManualRulesData } from '../../manual-triggers-container/main';

export type RuleExecutionState = 'SUCCEED' | 'FAILURE' | 'NONE';

export type MenuContext = Omit<ManualRulesData, 'error'> & {
	analyticsSource: string;
	baseAutomationUrl: string;
	canManageAutomation: boolean;
	emptyStateAdminDescription?: React.ReactNode;
	emptyStateDescription?: React.ReactNode;
	fetchError: any;
	objectAri: string;
	ruleExecutionState: RuleExecutionState;
};
