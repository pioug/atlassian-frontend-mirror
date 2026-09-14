// This is another layer on top of the AFE ManualRulesContainer.
// It is necessary that this container wraps the entire "automation" component and not nested. Else the user input form will not render correctly.
// This container provides an automation context to all children components through the useAutomationMenu hook.

import React, { useState } from 'react';

import { ManualRulesContainer } from '../../manual-triggers-container/ManualRulesContainer';
import type { ManualRulesData } from '../../manual-triggers-container/main';
import { AutomationMenuProvider } from './AutomationMenuProvider';
import type { MenuContext, RuleExecutionState } from './main';

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
