import type { ComponentType } from 'react';

import { ruleNodeAdf } from '../__fixtures__/full-width-adf';
import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';

export const RuleRenderer: ComponentType<any> = generateRendererComponent({
	document: ruleNodeAdf,
	appearance: 'full-width',
});
