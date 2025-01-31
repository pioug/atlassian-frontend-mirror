import React, { type Dispatch, type SetStateAction } from 'react';

import { MenuGroup } from '@atlaskit/menu';
import { fg } from '@atlaskit/platform-feature-flags';
import { Stack } from '@atlaskit/primitives/compiled';

import type { ManualRule } from '../../../manual-triggers-container/common/types';
import { useAutomationMenu } from '../../menu-context';
import { AutomationModalEmptyState } from '../empty-state';
import { AutomationModalRule } from '../rule';

import { AutomationModalRuleListOld } from './AutomationModalRuleListOld';

type AutomationModalRuleListProps = {
	selectedRule: ManualRule | undefined;
	setSelectedRule: Dispatch<SetStateAction<ManualRule | undefined>>;
};

const AutomationModalRuleListNew = ({
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

export const AutomationModalRuleList = (props: AutomationModalRuleListProps) => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <AutomationModalRuleListNew {...props} />;
	}
	return <AutomationModalRuleListOld {...props} />;
};
