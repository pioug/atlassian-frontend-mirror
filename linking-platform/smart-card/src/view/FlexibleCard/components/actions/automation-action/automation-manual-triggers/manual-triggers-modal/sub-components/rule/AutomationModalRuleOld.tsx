import React, { type Dispatch, type SetStateAction } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { ButtonItem } from '@atlaskit/menu';
import { Box, Stack, xcss } from '@atlaskit/primitives';
import Spinner from '@atlaskit/spinner';

import type { ManualRule } from '../../../manual-triggers-container/common/types';
import { useAutomationMenu } from '../../menu-context';

type AutomationModalRuleProps = {
	rule: ManualRule;
	selectedRule: ManualRule | undefined;
	setSelectedRule: Dispatch<SetStateAction<ManualRule | undefined>>;
};

const ruleButtonStyle = xcss({
	borderColor: 'color.border',
	borderStyle: 'solid',
	borderWidth: 'border.width',
	borderRadius: 'border.radius',
});

const selectedRuleButtonStyle = xcss({
	backgroundColor: 'color.background.accent.blue.subtlest',
	borderColor: 'color.border.accent.blue',
	borderStyle: 'solid',
	borderWidth: 'border.width.outline',
	borderRadius: 'border.radius',
});

const ruleNameStyle = xcss({
	// Using this to increase the height of the button itself.
	height: '28px',
});

export const AutomationModalRuleOld = ({
	rule,
	selectedRule,
	setSelectedRule,
}: AutomationModalRuleProps) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();

	const { analyticsSource, invokingRuleId } = useAutomationMenu();

	const isSelectedRule = selectedRule?.id === rule.id;
	const isExecuting = rule.id === invokingRuleId;

	const ruleOnClick = () => {
		createAnalyticsEvent({
			type: 'sendUIEvent',
			data: {
				action: 'clicked',
				actionSubject: 'button',
				actionSubjectId: 'selectManualTriggerAutomation',
				source: analyticsSource,
				attributes: {
					ruleId: rule.id.toString(),
				},
			},
		}).fire();
		setSelectedRule(rule);
	};

	return (
		<Box xcss={isSelectedRule ? selectedRuleButtonStyle : ruleButtonStyle}>
			<ButtonItem
				isDisabled={!!invokingRuleId}
				iconBefore={isExecuting ? <Spinner size="small" /> : null}
				onClick={ruleOnClick}
			>
				<Stack xcss={ruleNameStyle} alignBlock="center">
					{rule.name}
				</Stack>
			</ButtonItem>
		</Box>
	);
};
