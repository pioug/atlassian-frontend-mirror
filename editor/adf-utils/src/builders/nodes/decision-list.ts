import type { DecisionListDefinition } from '@atlaskit/adf-schema/decision-list';
import type { DecisionItemDefinition } from '@atlaskit/adf-schema/decision-item';

export const decisionList =
	(attrs: DecisionListDefinition['attrs']) =>
	(...content: Array<DecisionItemDefinition>): DecisionListDefinition => ({
		type: 'decisionList',
		attrs,
		content,
	});
