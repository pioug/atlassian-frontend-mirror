import type { ComponentType } from 'react';

import { ruleNodeAdf, ruleNodeWithAttributesAdf } from '../__fixtures__/full-width-adf';
import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';

export const RuleRenderer: ComponentType<any> = generateRendererComponent({
	document: ruleNodeAdf,
	appearance: 'full-width',
});

export const RulesWithAttributesRenderer: ComponentType<any> = generateRendererComponent({
	document: ruleNodeWithAttributesAdf,
	appearance: 'full-width',
});

export const BreakoutRuleRenderer: ComponentType<any> = generateRendererComponent({
	document: {
		version: 1,
		type: 'doc',
		content: [
			{
				type: 'rule',
				marks: [{ type: 'breakout', attrs: { mode: 'wide', width: 760 } }],
			},
			{
				type: 'rule',
				marks: [{ type: 'breakout', attrs: { mode: 'wide', width: 760 } }],
			},
			{
				type: 'rule',
				marks: [{ type: 'breakout', attrs: { mode: 'wide', width: 760 } }],
			},
		],
	},
	appearance: 'full-width',
});
