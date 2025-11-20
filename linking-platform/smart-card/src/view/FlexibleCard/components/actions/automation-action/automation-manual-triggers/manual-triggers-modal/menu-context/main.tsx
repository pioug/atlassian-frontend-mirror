// This is another layer on top of the AFE ManualRulesContainer.
// It is necessary that this container wraps the entire "automation" component and not nested. Else the user input form will not render correctly.
// This container provides an automation context to all children components through the useAutomationMenu hook.
import React, { createContext, type ReactNode, useContext, useState } from 'react';

import { ManualRulesContainer, type ManualRulesData } from '../../manual-triggers-container';

type AutomationMenuContextContainerProps = {
	analyticsSource: string;
	baseAutomationUrl: string;
	canManageAutomation: boolean;
	children: () => React.ReactElement;
	emptyStateAdminDescription?: React.ReactNode;
	emptyStateDescription?: React.ReactNode;
	objectAri: string;
	onRuleInvocationFailure?: () => void;
	onRuleInvocationLifecycleDone?: () => void;
	onRuleInvocationSuccess?: () => void;
	siteAri: string;
};

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
}: AutomationMenuContextContainerProps): React.JSX.Element => {
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
