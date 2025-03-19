/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type Dispatch, type SetStateAction } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { cssMap, jsx } from '@atlaskit/css';
import { ButtonItem } from '@atlaskit/menu';
import { Box, Stack } from '@atlaskit/primitives/compiled';
import Spinner from '@atlaskit/spinner';
import { token } from '@atlaskit/tokens';

import type { ManualRule } from '../../../manual-triggers-container/common/types';
import { useAutomationMenu } from '../../menu-context';

const styles = cssMap({
	ruleButtonStyle: {
		borderColor: token('color.border'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		borderRadius: token('border.radius'),
	},
	selectedRuleButtonStyle: {
		borderColor: token('color.border.accent.blue'),
		borderStyle: 'solid',
		borderWidth: token('border.width.outline'),
		borderRadius: token('border.radius'),
	},
	ruleNameStyle: {
		height: '28px',
	},
});

type AutomationModalRuleProps = {
	rule: ManualRule;
	selectedRule: ManualRule | undefined;
	setSelectedRule: Dispatch<SetStateAction<ManualRule | undefined>>;
};

export const AutomationModalRule = ({
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
		<Box
			xcss={isSelectedRule ? styles.selectedRuleButtonStyle : styles.ruleButtonStyle}
			backgroundColor={isSelectedRule ? 'color.background.accent.blue.subtlest' : undefined}
		>
			<ButtonItem
				isDisabled={!!invokingRuleId}
				iconBefore={isExecuting ? <Spinner size="small" /> : null}
				onClick={ruleOnClick}
			>
				<Stack xcss={styles.ruleNameStyle} alignBlock="center">
					{rule.name}
				</Stack>
			</ButtonItem>
		</Box>
	);
};
