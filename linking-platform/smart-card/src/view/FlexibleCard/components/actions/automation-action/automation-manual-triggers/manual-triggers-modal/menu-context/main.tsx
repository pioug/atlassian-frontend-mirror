// This is another layer on top of the AFE ManualRulesContainer.
// It is necessary that this container wraps the entire "automation" component and not nested. Else the user input form will not render correctly.
// This container provides an automation context to all children components through the useAutomationMenu hook.
import React, { createContext, type ReactNode, useContext, useState } from 'react';

import { ManualRulesContainer, type ManualRulesData } from '../../manual-triggers-container';

type AutomationMenuContextContainerProps = {
	baseAutomationUrl: string;
	objectAri: string;
	siteAri: string;
	canManageAutomation: boolean;
	analyticsSource: string;
	children: () => React.ReactElement;
	emptyStateDescription?: React.ReactNode;
	emptyStateAdminDescription?: React.ReactNode;
	onRuleInvocationSuccess?: () => void;
	onRuleInvocationFailure?: () => void;
	onRuleInvocationLifecycleDone?: () => void;
};

export type RuleExecutionState = 'SUCCEED' | 'FAILURE' | 'NONE';

export type MenuContext = Omit<ManualRulesData, 'error'> & {
	fetchError: any;
	analyticsSource: string;
	objectAri: string;
	baseAutomationUrl: string;
	canManageAutomation: boolean;
	emptyStateDescription?: React.ReactNode;
	emptyStateAdminDescription?: React.ReactNode;
	ruleExecutionState: RuleExecutionState;
};

type AutomationProviderProps = {
	children: ReactNode;
	value: MenuContext;
};
const AutomationMenuContext = createContext<MenuContext | undefined>(undefined);

const AutomationMenuProvider = ({ children, value }: AutomationProviderProps) => {
	return <AutomationMenuContext.Provider value={value}>{children}</AutomationMenuContext.Provider>;
};

// Hook that can be used anywhere under the AutomationMenuContextContainer to access the AutomationMenuContext values
export const useAutomationMenu = () => {
	const context = useContext(AutomationMenuContext);
	if (context === undefined) {
		throw new Error('useAutomationMenu must be used within a AutomationMenuProvider');
	}
	return context;
};

export const AutomationMenuContextContainer = ({
	baseAutomationUrl,
	analyticsSource,
	objectAri,
	siteAri,
	canManageAutomation,
	children,
	emptyStateDescription,
	emptyStateAdminDescription,
	onRuleInvocationSuccess,
	onRuleInvocationFailure,
	onRuleInvocationLifecycleDone,
}: AutomationMenuContextContainerProps) => {
	const [ruleExecutionState, setRuleExecutionState] = useState<RuleExecutionState>('NONE');
	return (
		<ManualRulesContainer
			site={siteAri}
			query={{
				objects: [objectAri],
			}}
			onRuleInvocationLifecycleStarted={() => {
				setRuleExecutionState('NONE');
			}}
			onRuleInvocationLifecycleDone={onRuleInvocationLifecycleDone}
			onRuleInvocationSuccess={() => {
				setRuleExecutionState('SUCCEED');
				onRuleInvocationSuccess?.();
			}}
			onRuleInvocationFailure={() => {
				setRuleExecutionState('FAILURE');
				onRuleInvocationFailure?.();
			}}
		>
			{(props: ManualRulesData) => {
				const contextValue: MenuContext = {
					...props,
					fetchError: props.error,
					analyticsSource,
					objectAri,
					baseAutomationUrl,
					canManageAutomation,
					emptyStateDescription,
					emptyStateAdminDescription,
					ruleExecutionState,
				};

				return <AutomationMenuProvider value={contextValue}>{children()}</AutomationMenuProvider>;
			}}
		</ManualRulesContainer>
	);
};
