import { snapshot } from '@af/visual-regression';

import { BreakoutRuleRenderer, RuleRenderer } from './rule.fixture.vr.ap';

snapshot(RuleRenderer);

snapshot(BreakoutRuleRenderer, {
	featureFlags: {
		platform_editor_breakout_spacing_in_renderer: [true, false],
	},
});
