import type { DecisionItemDefinition } from '@atlaskit/adf-schema/decision-item';
import type { DecisionListDefinition } from '@atlaskit/adf-schema/decision-list';

export const decisionList =
	(attrs: DecisionListDefinition['attrs']) =>
	(...content: Array<DecisionItemDefinition>): DecisionListDefinition => ({
		type: 'decisionList',
		attrs,
		content,
	});
