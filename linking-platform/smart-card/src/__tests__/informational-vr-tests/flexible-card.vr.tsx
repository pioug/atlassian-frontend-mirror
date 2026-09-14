import { snapshotInformational } from '@af/visual-regression';

import FlexibleUiElementLozengeDropdown from '../../../examples/vr-flexible-card/vr-flexible-ui-element-lozenge-dropdown.vr.ap';

snapshotInformational(FlexibleUiElementLozengeDropdown, {
	prepare: async (page, _component) => {
		await page.getByTestId('vr-test-lozenge-action').first().click();
	},
	description: 'Flexible UI Element Lozenge Dropdown - options',
	drawsOutsideBounds: true,
	featureFlags: {},
});

snapshotInformational(FlexibleUiElementLozengeDropdown, {
	prepare: async (page, _component) => {
		await page.getByTestId('vr-test-lozenge-action-error').first().click();
		page.getByTestId('vr-test-lozenge-action-error-open-embed').first();
	},
	description: 'Flexible UI Element Lozenge Dropdown - errored',
	drawsOutsideBounds: true,
	featureFlags: {},
});
