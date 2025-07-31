import { snapshotInformational } from '@af/visual-regression';

import FlexibleUiElementLozengeDropdown from '../../../examples/vr-flexible-card/vr-flexible-ui-element-lozenge-dropdown';

snapshotInformational(FlexibleUiElementLozengeDropdown, {
	prepare: async (page, _component) => {
		await page.getByTestId('vr-test-lozenge-action').click();
	},
	description: 'Flexible UI Element Lozenge Dropdown - options',
	drawsOutsideBounds: true,
	featureFlags: {
		'navx-1184-fix-smart-link-a11y-interactive-states': true,
	},
});

snapshotInformational(FlexibleUiElementLozengeDropdown, {
	prepare: async (page, _component) => {
		await page.getByTestId('vr-test-lozenge-action-error').click();
		page.getByTestId('vr-test-lozenge-action-error-open-embed').first();
	},
	description: 'Flexible UI Element Lozenge Dropdown - errored',
	drawsOutsideBounds: true,
	featureFlags: {
		'navx-1184-fix-smart-link-a11y-interactive-states': [true, false],
	},
});
