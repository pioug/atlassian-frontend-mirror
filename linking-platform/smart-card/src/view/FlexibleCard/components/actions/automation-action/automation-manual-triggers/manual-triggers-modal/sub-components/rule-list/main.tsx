import React, { type Dispatch, type SetStateAction } from 'react';

import { MenuGroup } from '@atlaskit/menu';
import { Stack } from '@atlaskit/primitives';

import type { ManualRule } from '../../../manual-triggers-container/common/types';
import { useAutomationMenu } from '../../menu-context';
import { AutomationModalEmptyState } from '../empty-state';
import { AutomationModalRule } from '../rule';

type AutomationModalRuleListProps = {
	selectedRule: ManualRule | undefined;
	setSelectedRule: Dispatch<SetStateAction<ManualRule | undefined>>;
};

export const AutomationModalRuleList = ({
	selectedRule,
	setSelectedRule,
}: AutomationModalRuleListProps) => {
	const { rules } = useAutomationMenu();

	if (rules.length === 0) {
		return <AutomationModalEmptyState />;
	}

	return (
		<MenuGroup>
			<Stack space="space.050">
				{rules.map((rule: ManualRule) => (
					<AutomationModalRule
						key={`manual-rule-${rule.id}`}
						rule={rule}
						selectedRule={selectedRule}
						setSelectedRule={setSelectedRule}
					/>
				))}
			</Stack>
		</MenuGroup>
	);
};
