import { snapshot } from '@af/visual-regression';

import {
	BreakoutRuleRenderer,
	RuleRenderer,
	RulesWithAttributesRenderer,
} from './rule.fixture.vr.ap';

snapshot(RuleRenderer);

snapshot(RulesWithAttributesRenderer, {
	featureFlags: {
		platform_editor_lovability_dividers_attributes: [true, false],
	},
});

snapshot(BreakoutRuleRenderer, {
	featureFlags: {
		platform_editor_breakout_spacing_in_renderer: [true, false],
	},
});
