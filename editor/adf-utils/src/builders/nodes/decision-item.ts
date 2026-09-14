import type { DecisionItemDefinition } from '@atlaskit/adf-schema/decision-item';
import type { Inline } from '@atlaskit/adf-schema/inline-content';

export const decisionItem =
	(attrs: DecisionItemDefinition['attrs']) =>
	(...content: Array<Inline>): DecisionItemDefinition => ({
		type: 'decisionItem',
		attrs,
		content,
	});
